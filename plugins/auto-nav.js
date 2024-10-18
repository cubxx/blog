import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
/**
 * @typedef {import('vitepress').DefaultTheme.NavItem} NavItem
 * @typedef {import('vitepress').DefaultTheme.SidebarItem} SidebarItem
 * @typedef {import('vitepress').DefaultTheme.SidebarMulti} SidebarMulti
 */

const log = (function () {
  const filepath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    'auto-nav.log',
  );
  fs.writeFile(filepath, new Date().toString() + '\n');
  /** @param {string[]} e */
  return function (...e) {
    fs.appendFile(filepath, e.join(' ') + '\n');
  };
})();
const IReg = { nav: /^-/, order: /^(\d+)_/ };
/**@param {string} dirname */
function dir_type(dirname) {
  return IReg.nav.test(dirname) ? 'nav' : 'side';
}
/**@param {string} itemname */
function side_item_order(itemname) {
  const matches = itemname.match(IReg.order);
  return matches ? +matches[1] : -1;
}
/**@param {string} itemname */
function pure_name(itemname) {
  return itemname.replace(IReg.nav, '').replace(IReg.order, '');
}

/**@param {string} src @param {Set<string>} ignoreItems */
async function generate(src, ignoreItems = new Set(['assets', 'pic'])) {
  /**@param {string} dirpath @returns {Promise<{files: string[], dirs: string[]}>} */
  async function to_file_items(dirpath) {
    const files = [];
    const dirs = [];
    for (const item of await fs.readdir(dirpath)) {
      if (ignoreItems.has(item)) continue;
      const itempath = path.join(dirpath, item);
      const stat = await fs.stat(itempath);
      stat.isDirectory() ? dirs.push(itempath) : files.push(itempath);
    }
    return { files, dirs };
  }
  /**@param {string} dirpath @returns {Promise<SidebarItem>} */
  async function dir_to_side(dirpath) {
    const { files, dirs } = await to_file_items(dirpath);
    const dirname = path.basename(dirpath);
    if (dir_type(dirname) !== 'side') {
      log("it's not side-dir", dirpath);
      return { text: pure_name(dirname), link: '/404' };
    }
    const file_sides = files
      .map((filepath) => {
        const routepath = `/${path
          .relative(src, dirpath)
          .replaceAll('\\', '/')}`;
        const { name } = path.parse(filepath);
        return name === 'index'
          ? log('side-dir should not have index file', dirpath)
          : { text: name, link: `${routepath}/${name}` };
      })
      .filter((e) => !!e);
    const dir_sides = await Promise.all(dirs.map(dir_to_side));
    return {
      text: pure_name(dirname),
      items: dir_sides
        .concat(file_sides)
        .map((e) => Object.assign(e, { order: side_item_order(e.text ?? '') }))
        .sort((a, b) => a.order - b.order),
    };
  }
  /**@param {string} dirpath @returns {Promise<NavItem>} */
  async function dir_to_nav(dirpath) {
    const { files, dirs } = await to_file_items(dirpath);
    const dirname = path.basename(dirpath);
    if (dir_type(dirname) === 'nav') {
      files.length && log('nav-dir should not have files', dirpath);
      //@ts-ignore
      return dirs.length
        ? {
            text: pure_name(dirname),
            items: await Promise.all(dirs.map(dir_to_nav)),
          }
        : { text: pure_name(dirname), link: '/404' };
    }
    const routepath = `/${path.relative(src, dirpath).replaceAll('\\', '/')}`;
    const sides = /**@type {SidebarItem[]} */ (
      (await dir_to_side(dirpath)).items
    );
    sidebar[`${routepath}/`] = sides;
    return sides.length
      ? { text: dirname, link: `${routepath}/${path.parse(files[0]).name}` }
      : { text: dirname, link: '/404' };
  }
  const { files, dirs } = await to_file_items(src);
  /**@type {SidebarMulti} */
  const sidebar = {};
  /**@type {NavItem[]} */
  const nav = await Promise.all(dirs.map(dir_to_nav));
  const data = { nav, sidebar };
  log(JSON.stringify(data, null, 2));
  return data;
}
export function AutoNav() {
  const name = '';
  const match_str = name.match(IReg.nav)?.[0];
  return /**@satisfies {import('vite').Plugin} */ ({
    name: 'auto-nav',
    async config(cfg) {
      // @ts-ignore
      const { vitepress } = cfg;
      Object.assign(
        vitepress.site.themeConfig,
        await generate(vitepress.userConfig.srcDir ?? './'),
      );
    },
  });
}
