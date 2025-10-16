<template>
  <render-api-documentation
    :component-wiki="componentStore.activeComponentWiki"
    :active-component="componentStore.activeComponentWiki"
  />
</template>

<script lang="ts" setup>
import RenderApiDocumentation from '@/components/render-api-documentation/index.vue';
import { useComponent } from '@/store/component';

// 获取组件
const componentStore = useComponent();
</script>
