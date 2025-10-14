import {
  defineStore,
} from 'pinia';
import {
  ref,
  computed
} from 'vue';

import type {
  IComponentWiki,
  INavGroups,
} from '@/types/component';

// 组件相关资源
export const useComponent = defineStore('component', () => {
  const version = ref('dev')
  const activeComponentWiki = ref<IComponentWiki | null>(null);
  const navGroups = ref<INavGroups | null>(null);
  const isLoadingNavGroups = ref<boolean>(false);
  const componentMetaList = computed(() => {
    if (!navGroups.value) return [];
    const {
      componentGroupMap = {},
      directiveList = []
    } = navGroups.value;
    const componentWikiList = Object.values(componentGroupMap).flatMap(
        group => group.map(componentWiki => ({
          componentWiki,
          type: 'component'
        }))
    );
    const directiveWikiList = directiveList.map(componentWiki => ({
      componentWiki,
      type: 'directive'
    }));
    return [...componentWikiList, ...directiveWikiList]
  })

  return {
    version,
    isLoadingNavGroups,
    navGroups,
    activeComponentWiki,
    componentMetaList
  };
});
