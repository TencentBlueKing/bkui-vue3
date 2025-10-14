<template>
  <section
    v-if="authorList.length"
    class="contributor-wrapper"
  >
    <h3 class="title">Contributor</h3>
    <div class="contributor-list">
      <a
        v-bk-tooltips="{
          content: item.username || '--',
        }"
        v-for="item in authorList"
        class="contributor-item"
        target="_blank"
        :key="item.username"
        :href="item.href"
      >
        <img
          class="contributor-item-img"
          loading="lazy"
          :src="item.img"
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

const componentStore = useComponent();

const vBkTooltips = bkTooltips;

const authorList = ref([])

const getFileAuthorList = async (name: string) => {
  try {
    authorList.value = await getFileAuthors(name);
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
    margin: 48px 0px 16px;
  }
  .contributor-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

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
