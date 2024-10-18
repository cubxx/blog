import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
/**
 * @typedef {import('vitepress').DefaultTheme.NavItem} NavItem
 * @typedef {import('vitepress').DefaultTheme.SidebarItem} SidebarItem
 * @typedef {import('vitepress').DefaultTheme.SidebarMulti} SidebarMulti
 */

const log = Object.assign((...e) => log.data.info.push(e), {
  data: {
    created: new Date().toString(),
    info: [],
  },
  async save() {
    fs.writeFile(
      path.join(path.dirname(fileURLToPath(import.meta.url)), 'auto-nav.json'),
      JSON.stringify(log.data, null, 2),
    );
  },
});
const t = {
  /**@readonly */
  IReg: { nav: /^-/, order: /^(\d+)\./ },
  /**@param {string} dirname */
  dir_type(dirname) {
    return t.IReg.nav.test(dirname) ? 'nav' : 'side';
  },
  /**@param {string} itemname */
  item_order(itemname) {
    const matches = itemname.match(t.IReg.order);
    return matches ? +matches[1] : Infinity;
  },
  /**@param {string} itemname */
  format(itemname) {
    return itemname.replace(t.IReg.nav, '').replace(t.IReg.order, '');
  },
};

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
      stat.isDirectory()
        ? dirs.push(itempath)
        : itempath.endsWith('.md') && files.push(itempath);
    }
    return { files, dirs };
  }
  /**@param {string} dirpath @returns {Promise<SidebarItem>} */
  async function to_side(dirpath) {
    const { files, dirs } = await to_file_items(dirpath);
    const dirname = path.basename(dirpath);
    if (t.dir_type(dirname) !== 'side') {
      log("it's not side-dir", dirpath);
      return { text: t.format(dirname), link: '/not-side-dir' };
    }
    const file_sides = files
      .map((filepath) => {
        const routepath = `/${path
          .relative(src, dirpath)
          .replaceAll('\\', '/')}`;
        const { name } = path.parse(filepath);
        return name === 'index'
          ? log('side-dir should not have index file', dirpath)
          : {
              text: t.format(name),
              link: `${routepath}/${name}`,
              order: t.item_order(name ?? ''),
            };
      })
      .filter((e) => !!e);
    const dir_sides = await Promise.all(dirs.map(to_side));
    return {
      text: t.format(dirname),
      items: dir_sides.concat(file_sides).sort((a, b) => a.order - b.order),
    };
  }
  /**@param {string} dirpath @returns {Promise<NavItem>} */
  async function to_nav(dirpath) {
    const { files, dirs } = await to_file_items(dirpath);
    const dirname = path.basename(dirpath);
    if (t.dir_type(dirname) === 'nav') {
      files.length && log('nav-dir should not have files', dirpath);
      return dirs.length
        ? {
            text: t.format(dirname),
            items: await Promise.all(dirs.map(to_nav)),
          }
        : { text: t.format(dirname), link: '/no-dirs' };
    }
    const side = await to_side(dirpath);
    sidebar[`/${path.relative(src, dirpath).replaceAll('\\', '/')}/`] =
      side.items ?? [];
    return (function side_to_nav(item) {
      return item.link
        ? { text: dirname, link: item.link }
        : item.items.length
          ? side_to_nav(item.items[0])
          : { text: dirname, link: '/no-items' };
    })(side);
  }
  const { files, dirs } = await to_file_items(src);
  /**@type {SidebarMulti} */
  const sidebar = {};
  /**@type {NavItem[]} */
  const nav = await Promise.all(dirs.map(to_nav));
  const data = { nav, sidebar };
  Object.assign(log.data, data);
  await log.save();
  return data;
}
export function AutoNav() {
  const name = '';
  const match_str = name.match(t.IReg.nav)?.[0];
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
generate('docs');
