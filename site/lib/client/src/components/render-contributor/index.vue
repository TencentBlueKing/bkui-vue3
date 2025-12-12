<template>
  <bk-loading
    :loading="loading"
    color="#f5f7fb"
    class="contributor-wrapper"
  >
    <h3 class="title">
      Contributor
    </h3>
    <div class="contributor-list g-scrollbar">
      <a
        v-for="item in authorList"
        v-bk-tooltips="{
          content: item.login,
        }"
        class="contributor-item"
        target="_blank"
        :key="item.login"
        :href="`https://github.com/${item.login}`"
      >
        <img
          class="contributor-item-img"
          loading="lazy"
          :src="item.avatar"
        >
      </a>
    </div>
  </bk-loading>
</template>
<script lang="ts" setup>
import {
  bkTooltips,
  Loading as BkLoading,
} from 'bkui-vue';
import {
  ref,
  watch,
} from 'vue';

import {
  getFileAuthors,
} from '@/http/api';
import {
  useComponent,
} from '@/store/component';
import type {
  IFileAuthor,
} from '@/types/component';

const componentStore = useComponent();

const vBkTooltips = bkTooltips;

const authorList = ref<IFileAuthor[]>([]);
const loading = ref(false);

const getFileAuthorList = async (name: string) => {
  try {
    loading.value = true;
    const type = componentStore.activeComponentWiki.group === '指令' ? 'directive' : 'component';
    authorList.value = await getFileAuthors(name, type);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

watch(
  () => componentStore.activeComponentWiki.name,
  (name) => {
    getFileAuthorList(name);
  },
  {
    immediate: true,
  },
);
</script>
<style lang="postcss" scoped>
.contributor-wrapper {
  display: flex;
  margin-top: 20px;
  align-items: center;

  .title {
    margin-right: 16px;
    line-height: 32px;
    font-weight: 700;
    font-size: 16px;
  }

  .contributor-list {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-wrap: nowrap;
    column-gap: 8px;
    overflow-x: auto;
    &::-webkit-scrollbar {
      width: 3px;
      height: 3px;
    }

    .contributor-item {
      height: 32px;
      width: 32px;
      cursor: pointer;
      flex-shrink: 0;
    }

    .contributor-item-img {
      display: block;
      width: 100%;
      height: 100%;
      border: 1px solid #DCDEE5;
      box-sizing: border-box;
      border-radius: 50%;
      object-fit: cover;
    }
  }
}
</style>
