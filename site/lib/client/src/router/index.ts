import {
  createRouter,
  createWebHistory,
} from 'vue-router';

const Entry = () => import(/* webpackChunkName: "entry" */ '../views/index.vue');
const Component = () => import(/* webpackChunkName: "component" */ '../views/children/component/index.vue');
const ComponentDemo = () => import(/* webpackChunkName: "component" */ '../views/children/component/children/demo.vue');
const ComponentApi = () => import(/* webpackChunkName: "component" */ '../views/children/component/children/api.vue');
const ComponentDesign = () => import(/* webpackChunkName: "component" */ '../views/children/component/children/design.vue');
const Markdown = () => import(/* webpackChunkName: "markdown" */ '../views/children/markdown/index.vue');
const Directive = () => import(/* webpackChunkName: "directive" */ '../views/children/directive/index.vue');

export default createRouter({
  history: createWebHistory(window.SITE_URL),
  routes: [
    {
      path: '/',
      redirect: 'markdown/start',
      component: Entry,
      children: [
        {
          path: 'component/:componentName',
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
