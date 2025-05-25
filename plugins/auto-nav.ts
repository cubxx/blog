import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Plugin } from 'vite';
import type { DefaultTheme } from 'vitepress';

type NavItem = DefaultTheme.NavItemWithLink | DefaultTheme.NavItemWithChildren;
type SidebarItem = DefaultTheme.SidebarItem & { order?: number };

const log = Object.assign((...e: unknown[]) => log.data.info.push(e), {
  data: {
    created: new Date().toString(),
    info: [] as unknown[],
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
  dir_type(dirname: string) {
    return t.IReg.nav.test(dirname) ? 'nav' : 'side';
  },
  item_order(itemname: string) {
    const matches = itemname.match(t.IReg.order);
    return matches ? +matches[1] : Infinity;
  },
  format(itemname: string) {
    return itemname.replace(t.IReg.nav, '').replace(t.IReg.order, '');
  },
};

async function generate(src: string, ignoreItems = new Set(['assets', 'pic'])) {
  async function to_file_items(dirpath: string) {
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
  async function to_side(dirpath: string): Promise<SidebarItem> {
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
        if (name === 'index') {
          log('side-dir should not have index file', dirpath);
          return null;
        }
        return {
          text: t.format(name),
          link: `${routepath}/${name}`,
          order: t.item_order(name ?? ''),
        };
      })
      .filter((e) => !!e);
    const dir_sides = await Promise.all(dirs.map(to_side));
    return {
      text: t.format(dirname),
      items: dir_sides
        .concat(file_sides)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    };
  }
  async function to_nav(dirpath: string): Promise<NavItem> {
    const { files, dirs } = await to_file_items(dirpath);
    const dirname = path.basename(dirpath);
    if (t.dir_type(dirname) === 'nav') {
      files.length && log('nav-dir should not have files', dirpath);
      return dirs.length
        ? {
            text: t.format(dirname),
            //@ts-ignore
            items: await Promise.all(dirs.map(to_nav)),
          }
        : {
            text: t.format(dirname),
            link: '/no-dirs',
          };
    }
    const side = await to_side(dirpath);
    sidebar[`/${path.relative(src, dirpath).replaceAll('\\', '/')}/`] =
      side.items ?? [];
    return (function side_to_nav(item): DefaultTheme.NavItemWithLink {
      return item.link
        ? { text: dirname, link: item.link }
        : item.items?.length
          ? side_to_nav(item.items[0])
          : { text: dirname, link: '/no-items' };
    })(side);
  }
  const { files, dirs } = await to_file_items(src);
  const sidebar: DefaultTheme.SidebarMulti = {};
  const nav: NavItem[] = await Promise.all(dirs.map(to_nav));
  const data = { nav, sidebar };
  Object.assign(log.data, data);
  await log.save();
  return data;
}
export function AutoNav() {
  const name = '';
  const match_str = name.match(t.IReg.nav)?.[0];
  return {
    name: 'auto-nav',
    async config(cfg) {
      // @ts-ignore
      const { vitepress } = cfg;
      Object.assign(
        vitepress.site.themeConfig,
        await generate(vitepress.userConfig.srcDir ?? './'),
      );
    },
  } satisfies Plugin;
}
generate('docs');
