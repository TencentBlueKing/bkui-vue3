import {
  createPinia,
} from 'pinia';
import {
  createApp,
} from 'vue';

import App from './app.vue';
import router from './router';

import './css/index.css';
import '../static/bk_icon_font/style.css';

createApp(App)
  .use(router)
  .use(createPinia())
  .mount('.app');
