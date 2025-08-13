import {
  defineStore,
} from 'pinia';
import {
  ref,
} from 'vue';

import type {
  IComponentWiki,
  INavGroups,
} from '@/types/component';

// 组件相关资源
export const useComponent = defineStore('component', () => {
  const activeComponentWiki = ref<IComponentWiki | null>(null);
  const navGroups = ref<INavGroups | null>(null);
  const isLoadingNavGroups = ref<boolean>(false);

  return {
    isLoadingNavGroups,
    navGroups,
    activeComponentWiki,
  };
});
