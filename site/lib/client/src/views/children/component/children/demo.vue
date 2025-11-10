<template>
  <bk-loading
    :loading="!componentStore.activeComponentWiki"
    :z-index="10"
    class="demo-home g-scrollbar"
  >
    <template v-if="componentStore.activeComponentWiki">
      <render-edit-component
        :component="component"
        :component-wiki="componentStore.activeComponentWiki"
        :loading="loading"
      />
      <render-contributor />
      <render-bottom-nav />
    </template>
  </bk-loading>
</template>

<script lang="ts" setup>
import {
  Loading as BkLoading,
} from 'bkui-vue';
import {
  onBeforeMount,
  onBeforeUnmount,
  ref,
  shallowRef,
  watch,
} from 'vue';

import RenderBottomNav from '@/components/render-bottom-nav/index.vue';
import RenderContributor from '@/components/render-contributor/index.vue';
import RenderEditComponent from '@/components/render-edit-component/index.vue';
import {
  useExternals,
} from '@/hooks/use-externals';
import {
  useHotUpdate,
} from '@/hooks/use-hot-update';
import {
  getComponent,
  getCss,
} from '@/http/api';
import {
  useComponent,
} from '@/store/component';

// 注入 externals
useExternals();
// hot update
const {
  addHotUpdateFunction,
  removeHotUpdateFunction,
} = useHotUpdate();
// component store
const componentStore = useComponent();

const component = shallowRef();
const loading = ref(true);
let requestSequence = 0;

const getComponentType = () => {
  return componentStore.activeComponentWiki?.group === '指令' ? 'directive' : 'component';
};

const handleGetComponent = () => {
  if (componentStore.activeComponentWiki) {
    const currentRequestId = ++requestSequence;
    loading.value = true;
    Promise
      .all([
        getComponent(
          componentStore.activeComponentWiki.name,
          componentStore.version,
          getComponentType(),
          { requestKey: 'component:main' },
        ),
        getCss(
          componentStore.activeComponentWiki.name,
          componentStore.version,
          getComponentType(),
          { requestKey: 'css:main' },
        ),
      ])
      .then(() => {
        if (currentRequestId !== requestSequence) {
          return;
        }
        component.value = window.getComponent();
      })
      .catch((error) => {
        if (error?.name === 'AbortError') {
          return;
        }
        console.error(error);
      })
      .finally(() => {
        if (currentRequestId === requestSequence) {
          loading.value = false;
        }
      });
  }
};

watch(
  () => componentStore.activeComponentWiki,
  handleGetComponent,
  {
    immediate: true,
  },
);

onBeforeMount(() => {
  addHotUpdateFunction(handleGetComponent);
});

onBeforeUnmount(() => {
  removeHotUpdateFunction(handleGetComponent);
});
</script>

<style lang="postcss" scoped>
.demo-home {
  height: calc(100% - 149px);
  padding: 24px 40px 32px;
  overflow: auto;
}
</style>
