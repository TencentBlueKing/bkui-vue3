<template>
  <ul class="aside-nav">
    <template
      v-for="(componentWikis, groupName) in componentStore.navGroups?.componentGroupMap"
      :key="groupName"
    >
      <li>
        {{ groupName }}
      </li>
      <li
        v-for="componentWiki in componentWikis"
        :key="componentWiki.title"
        :class="{
          'aside-nav-item': true,
          active: componentWiki === componentStore.activeComponentWiki,
        }"
        @click="handleChoose(componentWiki, 'component')"
      >
        {{ componentWiki.title }}
        {{ componentWiki.titleCN }}
      </li>
    </template>
    <template
      v-for="componentWiki in componentStore.navGroups?.directiveList"
      :key="componentWiki.name"
    >
      <li
        :class="{
          'aside-nav-item': true,
          active: componentWiki === componentStore.activeComponentWiki,
        }"
        @click="handleChoose(componentWiki, 'directive')"
      >
        {{ componentWiki.title }}
        {{ componentWiki.titleCN }}
      </li>
    </template>
  </ul>
</template>

<script lang="ts" setup>
import {
  onBeforeMount,
  onBeforeUnmount,
} from 'vue';
import {
  useRoute,
  useRouter,
} from 'vue-router';

import {
  useHotUpdate,
} from '@/hooks/use-hot-update';
import {
  getNavGroups,
} from '@/http/api';
import {
  useComponent,
} from '@/store/component';
import type {
  IComponentWiki,
} from '@/types/component';

const route = useRoute();
const router = useRouter();

const componentStore = useComponent();
// hot update
const {
  addHotUpdateFunction,
  removeHotUpdateFunction,
} = useHotUpdate();

const handleChoose = (value: IComponentWiki, type: string) => {
  componentStore.activeComponentWiki = value;
  router.push({
    name: type,
    params: {
      componentName: value.name,
    },
  });
};

const handleInit = async () => {
  try {
    componentStore.isLoadingNavGroups = true;
    // 设置 navGroups
    const navGroups = await getNavGroups('dev');
    componentStore.navGroups = navGroups;
    // 设置 activeComponentWiki
    if (route.params.componentName) {
      const componentWikiList = Object.values(componentStore.navGroups.componentGroupMap).reduce(
        (acc, cur) => {
          acc.push(...cur);
          return acc;
        },
        [],
      );
      const componentWiki = componentWikiList.find(componentWiki => componentWiki.name === route.params.componentName);
      handleChoose(componentWiki, 'component');
    }
  } catch (error) {
    console.error(error);
  } finally {
    componentStore.isLoadingNavGroups = false;
  }
};

onBeforeMount(() => {
  handleInit();
  addHotUpdateFunction(handleInit);
});

onBeforeUnmount(() => {
  removeHotUpdateFunction(handleInit);
});
</script>

<style lang="postcss" scoped>
.aside-nav {
  width: 260px;
  height: 100%;
  background: #FFFFFF;
  border-right: 1px solid #DCDEE5;
}
.aside-nav-item {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}
.aside-nav-item.active {
  background-color: #e0e0e0;
}
</style>
