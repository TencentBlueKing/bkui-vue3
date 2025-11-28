<template>
  <article>
    <render-header
      :title="componentStore.activeComponentWiki?.title"
      :title-c-n="componentStore.activeComponentWiki?.titleCN"
      :description="componentStore.activeComponentWiki?.description"
    />
    <render-router-tab
      :routers="routers"
    />
    <router-view />
  </article>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import RenderHeader from '@/components/render-header/index.vue';
import RenderRouterTab from '@/components/render-router-tab/index.vue';
import {
  useComponent,
} from '@/store/component';

const componentStore = useComponent();
const route = useRoute();

const routerTabs = [
  { routeName: 'demo', name: '组件示例' },
  { routeName: 'api', name: 'API 文档' },
  { routeName: 'design', name: '设计规范' },
];

const routers = computed(() => {
  const isDirectiveRoute = typeof route.name === 'string' && (route.name === 'directive' || route.name.startsWith('directive-'));
  return routerTabs.map(tab => ({
    to: isDirectiveRoute ? `directive-${tab.routeName}` : tab.routeName,
    name: tab.name,
  }));
});
</script>
