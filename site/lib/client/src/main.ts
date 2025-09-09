import {
  bkTooltips,
} from 'bkui-vue';
import {
  createPinia,
} from 'pinia';
import {
  createApp,
} from 'vue';

import {
  BkXssFilterDirective,
} from '@blueking/xss-filter';

import App from './app.vue';
import router from './router';

import './css/index.css';
import '../static/bk_icon_font/style.css';

createApp(App)
  .use(BkXssFilterDirective)
  .use(router)
  .use(createPinia())
  .directive('bkTooltips', bkTooltips)
  .mount('.app');
