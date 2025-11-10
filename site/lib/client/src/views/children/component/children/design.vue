<template>
  <bk-loading
    :loading="loading"
    :z-index="10"
    class="design-home g-scrollbar"

  >
    <render-markdown
      v-if="design"
      :parse-tag-list="['h2']"
      container-class-name=".design-home"
      :content="design"
      class=".design-markdown"
    />
    <bk-exception
      v-else
      type="empty"
      description="暂无设计规范"
    />

  </bk-loading>
</template>

<script lang="ts" setup>
import {
  Exception as BkException,
  Loading as BkLoading,
} from 'bkui-vue';
import {
  onBeforeMount,
  ref,
} from 'vue';
import {
  useRoute,
} from 'vue-router';

import RenderMarkdown from '@/components/render-markdown/index.vue';
import {
  getDesign,
} from '@/http/api';

const route = useRoute();

const design = ref<string>('');
const loading = ref(true);

const handleGetDesign = () => {
  loading.value = true;
  getDesign(route.params.name as string)
    .then((res) => {
      design.value = res;
    })
    .finally(() => {
      loading.value = false;
    });
};

onBeforeMount(handleGetDesign);
</script>

<style lang="postcss" scoped>
.design-home {
  height: calc(100% - 149px);
  padding: 16px 8px 40px 16px;
  overflow: auto;
  scroll-behavior: smooth;

  .design-markdown {
    margin: 0 auto;
  }

  :deep(.bk-exception) {
    margin-top: 100px;
    .bk-exception-description {
      margin-top: -20px;
    }
  }
}
</style>
