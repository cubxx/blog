import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';
import { AutoNav } from '../plugins/auto-nav';

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    title: 'blog',
    description: '',
    base: '/blog/',
    srcDir: 'docs',
    cleanUrls: true,
    markdown: {
      image: { lazyLoading: true },
      math: true,
    },
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      search: { provider: 'local' },
      socialLinks: [{ icon: 'github', link: 'https://github.com/cubxx' }],
      outline: { level: [2, 3] },
      editLink: {
        pattern: 'https://github.com/cubxx/blog/edit/main/docs/:path',
      },
      lastUpdated: {},
    },
    vite: {
      plugins: [AutoNav()],
      resolve: { alias: { '~': '../../..' } },
    },
    mermaid: {},
  }),
);
