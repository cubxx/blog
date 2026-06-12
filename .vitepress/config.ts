import { withMermaid } from 'vitepress-plugin-mermaid';
import { AutoNav } from '../plugins/auto-nav';

// https://vitepress.dev/reference/site-config
export default withMermaid({
  title: 'blog',
  description: '',
  base: '/blog/',
  srcDir: 'docs',
  cleanUrls: true,
  markdown: {
    image: {
      lazyLoading: true,
    },
    async config(md) {
      md.use(await import('@vscode/markdown-it-katex').then((m) => m.default), {
        output: 'html',
        throwOnError: true,
      });
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local',
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/cubxx',
      },
    ],
    outline: {
      level: [2, 3],
    },
    editLink: {
      pattern: 'https://github.com/cubxx/blog/edit/main/docs/:path',
    },
    lastUpdated: {},
  },
  vite: {
    plugins: [AutoNav()],
    resolve: {
      alias: {
        '~': process.cwd(),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            id.includes('math') && console.log(id);
          },
        },
      },
    },
  },
  mermaid: {},
});
