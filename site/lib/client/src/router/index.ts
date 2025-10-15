import {
  createRouter,
  createWebHistory,
} from 'vue-router';
import useStorage from '@/hooks/use-storage';
import { ANCHOR_KEY, VERSION_KEY } from '@/types/contants';

const Entry = () => import(/* webpackChunkName: "entry" */ '../views/index.vue');
const Component = () => import(/* webpackChunkName: "component" */ '../views/children/component/index.vue');
const ComponentDemo = () => import(/* webpackChunkName: "component" */ '../views/children/component/children/demo.vue');
const ComponentApi = () => import(/* webpackChunkName: "component" */ '../views/children/component/children/api.vue');
const ComponentDesign = () => import(/* webpackChunkName: "component" */ '../views/children/component/children/design.vue');
const Markdown = () => import(/* webpackChunkName: "markdown" */ '../views/children/markdown/index.vue');
const Directive = () => import(/* webpackChunkName: "directive" */ '../views/children/directive/index.vue');

const router = createRouter({
  history: createWebHistory(window.SITE_URL),
  routes: [
    {
      path: '/',
      meta: {
        requireVersion: false,
      },
      redirect: 'markdown/start',
      component: Entry,
      children: [
        {
          path: 'component/:componentName',
          name: 'component',
          meta: {
            requireVersion: true,
          },
          component: Component,
          children: [
            {
              path: 'demo',
              name: 'demo',
              component: ComponentDemo,
            },
            {
              path: 'api',
              name: 'api',
              component: ComponentApi,
            },
            {
              path: 'design',
              name: 'design',
              component: ComponentDesign,
            },
          ],
        },
        {
          path: 'markdown/:markdownName',
          name: 'markdown',
          component: Markdown,
        },
        {
          path: 'directive/:directiveName',
          name: 'directive',
          component: Directive,
        },
      ],
    },
  ],
});

/**
 * @description 路由守卫
 */
router.beforeEach((to, from, next) => {
  const {getStorage}=useStorage();
  const hash = getStorage(ANCHOR_KEY);
  if (to.meta.requireVersion && !to.query.version) {
    next({
      path: `${to.path}/api`,
      query: {
        ...to.query,
        version: getStorage(VERSION_KEY) ?? 'dev',
      },
      hash: hash ? `#${hash}` : '',
    });
  } else {
    next();
  }
});

export default router;
