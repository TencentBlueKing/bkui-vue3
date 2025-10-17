<template>
  <section class="bottom-nav">
    <span
      class="bottom-nav-link"
      @click="handleChoose(adjacentComponents.prevCom)"
    >
      <template v-if="adjacentComponents.prevCom">
        <AngleLeft class="icon"/>
        {{
          adjacentComponents.prevCom
            ? `${adjacentComponents.prevCom.componentWiki.title} ${adjacentComponents.prevCom.componentWiki.titleCN}`
            : ''
        }}
      </template>
    </span>
    <span
      class="bottom-nav-link"
      @click="handleChoose(adjacentComponents.nextCom)"
    >
      <template v-if="adjacentComponents.nextCom">
        {{
          adjacentComponents.nextCom
          ? `${adjacentComponents.nextCom.componentWiki.titleCN} ${adjacentComponents.nextCom.componentWiki.title}`
          : ''
        }}
        <AngleRight class="icon"/>
      </template>
    </span>
  </section>
</template>
<script lang="ts" setup>
import {
  AngleLeft,
  AngleRight
}  from 'bkui-vue/lib/icon';
import {
  useComponent,
} from '@/store/component';
import {
  computed
} from 'vue';
import {
  useRouter
} from 'vue-router';
import type {
  IComponentWiki,
  IComponentMeta
} from '@/types/component';

const router = useRouter();
const componentStore = useComponent();

const adjacentComponents = computed(() => {
  let prevCom = null;
  let nextCom = null;
  const index = componentStore.componentMetaList
    .findIndex((item) => item.componentWiki.name === componentStore.activeComponentWiki.name);
  if (index > 0) {
    prevCom = componentStore.componentMetaList[index - 1];
  }
  if (index < componentStore.componentMetaList.length - 1) {
    nextCom = componentStore.componentMetaList[index + 1];
  }
  return {
    prevCom,
    nextCom,
  };
});

const handleChoose = (item: IComponentMeta) => {
  if(!item) return
  componentStore.activeComponentWiki = item.componentWiki;
  router.push({
    name: item.type,
    params: {
      componentName: item.componentWiki.name,
    },
  });
};

</script>
<style lang="postcss" scoped>
.bottom-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 23px -6px 0;
  font-size: 16px;
  color: #313238;
  user-select: none;
  .bottom-nav-link {
    display: flex;
    align-items: center;
    cursor: pointer;
    .icon {
      font-size: 26px;
    }
  }
}
</style>
