<template>
  <article>
    <bk-loading
      :loading="loading"
      :z-index="10"
      style="height: 100%;"
    >
      <render-header
        :title="wikiHeaderInfo.title"
        :title-c-n="wikiHeaderInfo.titleCN"
        :description="wikiHeaderInfo.description"
      />
      <div class="markdown-home g-scrollbar">
        <render-markdown
          v-if="content"
          :parse-tag-list="parseTagList"
          :content="content"
          container-class-name=".markdown-home"
        />
      </div>
    </bk-loading>
  </article>
</template>

<script lang="ts" setup>
import {
  Loading as BkLoading,
} from 'bkui-vue';
import {
  computed,
  ref,
  watch,
} from 'vue';
import {
  useRoute,
} from 'vue-router';

import RenderHeader from '@/components/render-header/index.vue';
import RenderMarkdown from '@/components/render-markdown/index.vue';
import {
  getNpmMarkdown,
} from '@/http/api';
import StartMarkdown from '@/markdowns/start.md';
import {
  useComponent,
} from '@/store/component';

import ChangelogMarkdown from '../../../../../../changelog.md';

const componentStore = useComponent();

const route = useRoute();

const content = ref('');
const loading = ref(false);
const parseTagList = ref(['h1', 'h2', 'h3', 'h4']);

const wikiHeaderInfo = computed(() => {
  const routerName = route.path.split('/')[1];

  const component = componentStore.componentMetaList
    .filter(item => item.routerName === routerName)
    .find(item => item.componentWiki.name === route.params.name);

  return {
    title: component?.componentWiki.title,
    titleCN: component?.componentWiki.titleCN,
    description: component?.componentWiki.description,
  };
});

const handleGetMarkdownContent = () => {
  if (route.params.name === 'start') {
    content.value = StartMarkdown;
    parseTagList.value = ['h1', 'h2'];
  } else if (route.params.name === 'changelog') {
    content.value = ChangelogMarkdown;
    parseTagList.value = ['h3'];
  } else {
    content.value = '';
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
  height: calc(100% - 112px);
  padding: 16px 8px 40px 16px;
  overflow: auto;
  scroll-behavior: smooth;
}
</style>
