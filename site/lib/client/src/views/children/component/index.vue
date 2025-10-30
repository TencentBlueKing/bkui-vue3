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
import RenderHeader from '@/components/render-header/index.vue';
import RenderRouterTab from '@/components/render-router-tab/index.vue';
import {
  useComponent,
} from '@/store/component';

const componentStore = useComponent();

const routers = [
  { to: 'demo', name: '组件示例' },
  { to: 'api', name: 'API 文档' },
  { to: 'design', name: '设计规范' },
];
</script>
