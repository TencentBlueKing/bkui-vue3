<template>
  <section class="documentation-container g-scrollbar">
    <render-api-documentation
      :component-wiki="componentStore.activeComponentWiki"
      :active-component="componentStore.activeComponentWiki"
    />
  </section>
</template>

<script lang="ts" setup>
import RenderApiDocumentation from '@/components/render-api-documentation/index.vue';
import { useComponent } from '@/store/component';

// 获取组件
const componentStore = useComponent();
</script>

<style lang="postcss">
.documentation-container {
  margin-top: 3px;
  height: calc(100% - 152px);
  padding: 24px 8px 32px 40px;
  overflow: auto;
  scroll-behavior: smooth;
}
</style>
