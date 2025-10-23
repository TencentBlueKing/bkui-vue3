<template>
  <bk-loading
    :loading="loading"
     color="#f5f7fb"
    class="contributor-wrapper"
  >
    <h3 class="title">
      Contributor
    </h3>
    <div class="contributor-list">
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
  ref,
  watch,
} from 'vue';
import {
  bkTooltips,
  Loading as BkLoading,
} from 'bkui-vue';
import {
  getFileAuthors,
} from '@/http/api';
import {
  useComponent
} from "@/store/component";
import type {
  IFileAuthor,
} from '@/types/component';

const componentStore = useComponent();

const vBkTooltips = bkTooltips;

const authorList = ref<IFileAuthor[]>([])
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
}

watch(
  () => componentStore.activeComponentWiki.name,
  (name) => {
    getFileAuthorList(name)
  },
  {
    immediate: true
  }
)
</script>
<style lang="postcss" scoped>
.contributor-wrapper {
  height: 80px;
  .title {
    font-weight: 700;
    font-size: 20px;
    line-height: 28px;
    margin: 48px 0px 12px;
  }
  .contributor-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    height: 40px;

    .contributor-item{
      cursor: pointer;
    }

    .contributor-item-img {
      width: 40px;
      height: 40px;
      border: 1px solid #DCDEE5;
      border-radius: 50%;
    }
  }
}
</style>
