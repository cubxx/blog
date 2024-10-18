import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';
import { AutoNav } from '../plugins/auto-nav';

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    title: "Cubx's blog",
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
      search: {
        provider: 'local',
      },
      socialLinks: [{ icon: 'github', link: 'https://github.com/cubxx' }],
      outline: { level: [2, 3], label: '页面导航' },
      editLink: {
        text: '在 GitHub 上编辑此页面',
        pattern: 'https://github.com/cubxx/blog/edit/main/docs/:path',
      },
      lastUpdated: { text: '最后更新于' },
    },
    vite: { plugins: [AutoNav()] },
    mermaid: {},
  }),
);
