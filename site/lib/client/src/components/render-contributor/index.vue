<template>
  <section
    v-if="authorList.length"
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
  </section>
</template>
<script lang="ts" setup>
import {
  ref,
  watch,
} from 'vue';
import {
  bkTooltips,
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

const getFileAuthorList = async (name: string) => {
  try {
    authorList.value = await getFileAuthors(name, 'component');
  }catch (error) {
    console.error(error);
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
