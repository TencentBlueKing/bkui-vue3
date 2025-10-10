<template>
  <bk-loading
    class="component-home"
    :loading="componentStore.isLoadingNavGroups"
  >
    <render-nav />
    <router-view class="component-main" />
  </bk-loading>
</template>

<script lang="ts" setup>
import {
  Loading as BkLoading,
} from 'bkui-vue';

import RenderNav from '@/components/render-nav/index.vue';
import {
  useComponent,
} from '@/store/component';

const componentStore = useComponent();
</script>

<style lang="postcss" scoped>
.component-home {
  display: flex;
  margin-top: 64px;
  height: calc(100% - 64px);
}
.component-main {
  flex: 1;
  max-width: calc(100% - 260px);
}
</style>
