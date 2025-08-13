import {
  createApp,
} from 'vue';
import {
  createPinia,
} from 'pinia'
import router from './router';
import App from './app.vue';
import './css/index.css';

createApp(App)
  .use(router)
  .use(createPinia())
  .mount('.app');
