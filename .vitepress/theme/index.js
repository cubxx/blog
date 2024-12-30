import DefaultTheme from 'vitepress/theme';
import Hide from '../../components/hide.vue';

/**@type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Hide', Hide);
  },
};
