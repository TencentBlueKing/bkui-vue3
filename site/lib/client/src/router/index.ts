import { createRouter, createWebHistory } from 'vue-router';

const Entry = () => import(/* webpackChunkName: "entry" */ '../views/index.vue');
const Component = () => import(/* webpackChunkName: "component" */ '../views/children/component/index.vue');
const ComponentDemo = () => import(/* webpackChunkName: "component" */ '../views/children/component/children/demo.vue');
const ComponentApi = () => import(/* webpackChunkName: "component" */ '../views/children/component/children/api.vue');
const ComponentDesign = () => import(/* webpackChunkName: "component" */ '../views/children/component/children/design.vue');
const Markdown = () => import(/* webpackChunkName: "markdown" */ '../views/children/markdown/index.vue');

const router = createRouter({
  history: createWebHistory(window.SITE_URL),
  routes: [
    {
      path: '/',
      redirect: 'markdown/start',
      component: Entry,
      children: [
        {
          path: 'component/:name',
          name: 'component',
          redirect: {
            name: 'demo',
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
          path: 'directive/:name',
          name: 'directive',
          redirect: {
            name: 'directive-demo',
          },
          component: Component,
          children: [
            {
              path: 'demo',
              name: 'directive-demo',
              component: ComponentDemo,
            },
            {
              path: 'api',
              name: 'directive-api',
              component: ComponentApi,
            },
            {
              path: 'design',
              name: 'directive-design',
              component: ComponentDesign,
            },
          ],
        },
        {
          path: 'business-component/:name',
          name: 'business-component',
          component: Markdown,
        },
        {
          path: 'markdown/:name',
          name: 'markdown',
          component: Markdown,
        },
      ],
    },
  ],
});

export default router;
