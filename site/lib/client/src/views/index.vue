<template>
  <bk-loading
    class="component-home"
    :z-index="10"
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
import {
  watch,
} from 'vue';
import {
  useRouter,
} from 'vue-router';

import RenderNav from '@/components/render-nav/index.vue';
import {
  useComponent,
} from '@/store/component';

const componentStore = useComponent();
const router = useRouter();

// 监听 version 变化，同步到 URL query 参数
watch(
  () => componentStore.version,
  (newVersion) => {
    if (!newVersion) return;

    // 更新 URL 中的 version 参数，使用 replace 避免产生历史记录
    router.replace({
      ...router.currentRoute.value,
      query: {
        ...router.currentRoute.value.query,
        version: newVersion,
      },
    });
  },
);
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
