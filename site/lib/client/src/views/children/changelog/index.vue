<template>
  <article>
    <render-header
      :title="headerInfo.title"
      :title-c-n="headerInfo.titleCN"
      :description="headerInfo.description"
    />
    <div class="changelog-home g-scrollbar">
      <render-markdown
        :parse-tag-list="['h3']"
        v-if="content"
        container-class-name=".changelog-home"
        :content="content"
        class=".design-markdown"
      />
    </div>
  </article>
</template>

<script lang="ts" setup>

import { onBeforeMount, ref } from 'vue';

import RenderHeader from '@/components/render-header/index.vue';
import RenderMarkdown from '@/components/render-markdown/index.vue';
import ChangelogMarkdown from '@/markdowns/changelog.md';

const content = ref('');

const headerInfo =  ref({
  title: '版本日志',
  titleCN: '版本日志',
  description: 'MagicBox 版本更新严格遵循 Semantic Versioning 2.0.0 语义化版本规范。',
});

onBeforeMount(() => {
  content.value = ChangelogMarkdown;
});
</script>
<style lang="postcss" scoped>
.changelog-home {
  height: calc(100% - 112px);
  padding: 16px 8px 40px 16px;
  overflow: auto;
  scroll-behavior: smooth;

  /* .design-markdown {
    margin: 0 auto;
  }

  :deep(.bk-exception) {
    margin-top: 100px;
    .bk-exception-description {
      margin-top: -20px;
    }
  } */
}
</style>
