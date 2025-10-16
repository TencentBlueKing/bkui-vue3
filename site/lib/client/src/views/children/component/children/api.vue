<template>
  <bk-loading
    :loading="loading"
    class="demo-home"
  >
    <render-api-documentation
      :component="component"
      :component-wiki="componentStore.activeComponentWiki"
      :active-component="componentStore.activeComponentWiki"
    />
  </bk-loading>
</template>

<script lang="ts" setup>
  import { Loading as BkLoading } from 'bkui-vue';
  import { onBeforeMount, onBeforeUnmount, ref, shallowRef, watch } from 'vue';

  import RenderApiDocumentation from '@/components/render-api-documentation/index.vue';
  import { getComponent, getCss } from '@/http/api';
  import { useComponent } from '@/store/component';

  const component = shallowRef();

  // 获取组件
  const componentStore = useComponent();
  const loading = ref(false);

  /**
   * @description 更新组件
   */
  const handleGetComponent = () => {
    if (componentStore.activeComponentWiki) {
      loading.value = true;
      Promise.all([
        getComponent(componentStore.activeComponentWiki.name, 'dev'),
        getCss(componentStore.activeComponentWiki.name, 'dev'),
      ])
        .then(() => {
          component.value = window.getComponent().default;
        })
        .finally(() => {
          loading.value = false;
        });
    }
  };

  watch(() => componentStore.activeComponentWiki, handleGetComponent);

  onBeforeMount(() => {});

  onBeforeUnmount(() => {});
</script>

<style lang="postcss" scoped>
  .demo-home {
    width: 100%;
    height: calc(100% - 149px);
    padding: 16px 8px 40px 34px;
  }
</style>
