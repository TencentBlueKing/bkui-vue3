import {
  defineStore,
} from 'pinia';
import {
  computed,
  ref,
} from 'vue';

import type {
  IComponentWiki,
  INavGroups,
} from '@/types/component';

// 组件相关资源
export const useComponent = defineStore('component', () => {
  const version = ref('dev');
  const activeComponentWiki = ref<IComponentWiki | null>(null);
  const navGroups = ref<INavGroups | null>(null);
  const isLoadingNavGroups = ref<boolean>(false);
  const componentMetaList = computed(() => {
    if (!navGroups.value) return [];
    const {
      componentGroupMap = {},
      directiveList = [],
      customComponentList = [],
      startList = [],
    } = navGroups.value;
    return [
      ...mapToMetaList(startList, 'markdown'),
      ...mapToMetaList(Object.values(componentGroupMap).flat(), 'component'),
      ...mapToMetaList(directiveList, 'component'),
      ...mapToMetaList(customComponentList, 'markdown'),
    ];
  });

  const mapToMetaList = (items: IComponentWiki[], routerName: string) => items.map(componentWiki => ({
    componentWiki,
    routerName,
  }));

  return {
    version,
    isLoadingNavGroups,
    navGroups,
    activeComponentWiki,
    componentMetaList,
  };
});
