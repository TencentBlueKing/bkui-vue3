<template>
  <article>
    <h3
      class="wiki-title"
    >
      {{ componentStore.activeComponentWiki?.title }}
      {{ componentStore.activeComponentWiki?.titleCN }}
    </h3>
    <h5
      class="wiki-description"
    >
      {{ componentStore.activeComponentWiki?.description }}
    </h5>
    <render-router-tab
      :routers="routers"
    />
    <router-view />
  </article>
</template>

<script lang="ts" setup>
import {
  useComponent,
} from '@/store/component';
import RenderRouterTab from '@/components/render-router-tab/index.vue'

const componentStore = useComponent();

const routers = [
  { to: 'demo', name: '组件示例' },
  { to: 'api', name: 'API 文档' },
  { to: 'design', name: '设计规范' },
]
</script>

<style lang="postcss" scoped>
.wiki-title {
  padding: 16px 16px 11px 40px;
  font-weight: 600;
  font-size: 32px;
  line-height: 45px;
  color: #000000;
  background: #fff;
}
.wiki-description {
  padding: 0 16px 17px 40px;
  font-size: 14px;
  color: #313238;
  line-height: 22px;
  background: #fff;
}
</style>
