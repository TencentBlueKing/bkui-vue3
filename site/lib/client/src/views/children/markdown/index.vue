<template>
  <bk-loading
    :loading="loading"
    :z-index="10"
    class="markdown-home g-scrollbar"
  >
    <render-markdown
      :parse-tag-list="['h1', 'h2', 'h3', 'h4']"
      :content="content"
      container-class-name=".markdown-home"
    />
  </bk-loading>
</template>

<script lang="ts" setup>
import {
  Loading as BkLoading,
} from 'bkui-vue';
import {
  ref,
  watch,
} from 'vue';
import {
  useRoute,
} from 'vue-router';

import RenderMarkdown from '@/components/render-markdown/index.vue';
import {
  getNpmMarkdown,
} from '@/http/api';
import StartMarkdown from '@/markdowns/start.md';

const route = useRoute();

const content = ref('');
const loading = ref(false);

const handleGetMarkdownContent = () => {
  if (route.params.name === 'start') {
    content.value = StartMarkdown;
  } else {
    loading.value = true;
    getNpmMarkdown(route.params.name as string)
      .then((res) => {
        content.value = res;
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

watch(
  () => route.params.name,
  handleGetMarkdownContent,
  {
    immediate: true,
  },
);
</script>

<style lang="postcss" scoped>
.markdown-home {
  height: 100%;
  padding: 40px 24px;
  overflow: auto;
  background: #fff;
}
</style>
