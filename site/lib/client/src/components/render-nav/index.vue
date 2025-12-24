<template>
  <div class="aside-nav">
    <h1 class="aside-nav-header">
      <img
        class="aside-nav-header-logo"
        src="@/images/logo.png"
      />
      <span class="aside-nav-header-title">
        Vue 组件库
      </span>
      <bk-select
        v-model="componentStore.version"
        class="aside-nav-header-version"
        size="small"
        :clearable="false"
      >
        <template #suffix>
          <AngleUpFill width="12" />
        </template>
        <bk-option
          v-for="item in versionList"
          :id="item"
          :key="item"
          :name="item"
        />
      </bk-select>
    </h1>
    <div
      class="aside-nav-search-wrapper"
      v-clickoutside="hidePopover"
    >
      <bk-popover
        width="227"
        theme="light"
        trigger="manual"
        placement="bottom-start"
        :is-show="isPopoverShow"
        :arrow="false"
        disable-teleport
      >
        <bk-input
          class="aside-nav-search-input"
          v-model="searchVal"
          type="search"
          clearable
          @input="handleSearch"
          @enter="handleChooseCom()"
          @clear="hidePopover"
          @keydown="handleKeydown"
        />
        <template #content>
          <div class="search-dropdown-list">
            <ul
              ref="searchListContainerRef"
              class="search-dropdown-list-wrapper"
              :style="{
                maxHeight: `${contentMaxHeight}px`
              }"
            >
              <template v-if="renderList.length">
                <li
                  v-for="(item,index) in renderList"
                  :key="item.routerName + item.componentWiki.name"
                  :class="[
                    'search-dropdown-list-item',
                    selectIndex === index ? 'cur' : ''
                  ]"
                  @click="handleChooseCom(item)"
                >
                  <!-- eslint-disable vue/no-v-html -->
                  <span
                    v-html="highlightText(item.componentWiki.title, item.componentWiki.titleCN, searchVal)"
                    class="text"
                  />
                  <!-- eslint-enable vue/no-v-html -->
                </li>
              </template>
              <li
                v-else
                class="search-dropdown-list-item"
              >
                <span class="text">没有找到组件</span>
              </li>
            </ul>
          </div>
        </template>
      </bk-popover>
    </div>
    <ul
      ref="asideNavGroupRef"
      class="aside-nav-group g-scrollbar"
    >
      <li class="aside-nav-group-title" v-if="componentStore.navGroups?.startList.length">
        开始
      </li>
      <li
        v-for="start in componentStore.navGroups?.startList"
        :key="`${'markdown'}:${start.name}`"
        :class="{
          'aside-nav-group-item': true,
          active: `${'markdown'}:${start.name}` === activeName,
        }"
        @click="handleChoose(start, 'markdown')"
      >
        {{ start.titleCN }}
      </li>
      <template
        v-for="(componentWikis, groupName) in componentStore.navGroups?.componentGroupMap"
        :key="groupName"
      >
        <li class="aside-nav-group-title">
          {{ groupName }}
        </li>
        <li
          v-for="componentWiki in componentWikis"
          :key="`${'component'}:${componentWiki.name}`"
          :class="{
            'aside-nav-group-item': true,
            active: `${'component'}:${componentWiki.name}` === activeName,
          }"
          @click="handleChoose(componentWiki)"
        >
          {{ componentWiki.title }}
          {{ componentWiki.titleCN }}
        </li>
      </template>
      <template v-if="componentStore.navGroups?.directiveList.length">
        <li class="aside-nav-group-title">
          指令
        </li>
        <li
          v-for="directive in componentStore.navGroups?.directiveList"
          :key="`${'directive'}:${directive.name}`"
          :class="{
            'aside-nav-group-item': true,
            active: `${'directive'}:${directive.name}` === activeName,
          }"
          @click="handleChoose(directive, 'directive')"
        >
          {{ directive.title }}
          {{ directive.titleCN }}
        </li>
      </template>
      <template v-if="componentStore.navGroups?.customComponentList.length">
        <li class="aside-nav-group-title">
          业务组件
        </li>
        <li
          v-for="customCom in componentStore.navGroups?.customComponentList"
          :key="`${'business-component'}:${customCom.name}`"
          :class="{
            'aside-nav-group-item': true,
            active: `${'business-component'}:${customCom.name}` === activeName,
          }"
          @click="handleChoose(customCom,'business-component')"
        >
          {{ customCom.title }}
          {{ customCom.titleCN }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import {
  clickoutside,
  Input as BkInput,
  Popover as BkPopover,
  Select as BkSelect,
} from 'bkui-vue';
import {
  AngleUpFill,
}  from 'bkui-vue/lib/icon';
import {
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  ref,
  watch,
} from 'vue';
import {
  useRoute,
  useRouter,
} from 'vue-router';

import {
  useHotUpdate,
} from '@/hooks/use-hot-update';
import useStorage from '@/hooks/use-storage';
import {
  getNavGroups,
  getVersions,
} from '@/http/api';
import {
  useComponent,
} from '@/store/component';
import {
  IComponentMeta,
  IComponentWiki,
  INavGroups,
} from '@/types/component';
import {
  VERSION_KEY,
} from '@/types/contants';

import { filterXss } from '@blueking/xss-filter';

const route = useRoute();
const router = useRouter();

const componentStore = useComponent();
// hot update
const {
  addHotUpdateFunction,
  removeHotUpdateFunction,
} = useHotUpdate();
// storage
const {
  setStorage,
  getStorage,
} = useStorage();

const vClickoutside = clickoutside;
const BkOption = BkSelect.Option;
const SCROLL_OFFSET_TOP = 171;
const SCROLL_PADDING = 85;

const searchVal = ref('');
const activeName = ref('');
const selectIndex = ref(0);
const contentMaxHeight = ref(300);
const isPopoverShow = ref(false);
const searchListContainerRef = ref(null);
const asideNavGroupRef = ref(null);
const versionList = ref([]);
const renderList = ref<IComponentMeta[]>([]);

const hidePopover = () => {
  isPopoverShow.value = false;
};

/**
 * 高亮文本并过滤 XSS，允许 em 标签
 */
const highlightText = (title: string, titleCN: string, searchVal: string): string => {
  const text = `${title || ''} ${titleCN || ''}`.trim();
  if (!searchVal.trim()) {
    return filterXss(text);
  }
  // 先高亮匹配的文本
  const highlighted = text.replace(new RegExp(`(${searchVal})`, 'gi'), '<em>$1</em>');
  // 使用 filterXss 过滤，但允许 em 标签
  return filterXss(highlighted, {
    onTagAttr: (tag: string, name: string) => {
      // 允许 em 标签的所有属性
      if (tag === 'em') {
        return name;
      }
      return false;
    },
    onTag: (tag: string, html: string) => {
      // 允许 em 标签
      if (tag === 'em') {
        return html;
      }
      return '';
    },
  });
};

const handleSearch = () => {
  selectIndex.value = 0;
  doSearch();
};

const doSearch = () => {
  setTimeout(() => {
    if (searchListContainerRef.value) {
      searchListContainerRef.value.scrollTop = 0;
    }
  });
  const query = (searchVal.value.trim() || '')?.toLowerCase();

  if (query) {
    renderList.value = [
      ...componentStore.componentMetaList.filter(item => `${item.componentWiki.title} ${item.componentWiki.titleCN}`?.toLowerCase().indexOf(query) > -1),
    ];
  } else {
    renderList.value = [...componentStore.componentMetaList];
  }
  isPopoverShow.value = !!query;
};

const handleKeydown = (_val: string, e: KeyboardEvent) => {
  const { keyCode } = e;
  const { length } = renderList.value;
  switch (keyCode) {
    // 上
    case 38:
      e.preventDefault();
      if (selectIndex.value === -1 ||  selectIndex.value === 0) {
        selectIndex.value = length - 1;
        searchListContainerRef.value.scrollTop = searchListContainerRef.value.scrollHeight;
      } else {
        selectIndex.value =  selectIndex.value - 1;
        nextTick(() => {
          const curSelectNode = searchListContainerRef.value.querySelector('li.cur');
          const { offsetTop } = curSelectNode;
          if (offsetTop < searchListContainerRef.value.scrollTop) {
            searchListContainerRef.value.scrollTop -= 32;
          }
        });
      }
      break;
      // 下
    case 40:
      e.preventDefault();
      if (selectIndex.value < length - 1) {
        selectIndex.value = selectIndex.value + 1;
        nextTick(() => {
          const curSelectNode = searchListContainerRef.value.querySelector('li.cur');
          const { offsetTop } = curSelectNode;
          // searchListContainerRef.value 上下各有 6px 的 padding
          if (offsetTop > contentMaxHeight.value - 2 * 6) {
            // 每一个 item 是 32px height
            searchListContainerRef.value.scrollTop += 32;
          }
        });
      } else {
        selectIndex.value = 0;
        searchListContainerRef.value.scrollTop = 0;
      }
      break;
    case 13:
      e.preventDefault();
      if (renderList.value[selectIndex.value]) {
        handleChooseCom();
      }
      break;
    default:
      break;
  }
};

const handleChooseCom = async (config?: IComponentMeta) => {
  const item = config || renderList.value[selectIndex.value];
  if (!item) return;
  await handleChoose(item.componentWiki, item.routerName);
  hidePopover();
  searchVal.value = '';
  await nextTick(scrollToCurNavItem);
};

const handleChoose = async (value: IComponentWiki, routerName = 'component') => {
  await router.push({
    name: routerName,
    params: {
      name: value.name,
    },
  });
};

const getVersionList = async () => {
  try {
    versionList.value = await getVersions();
    if (versionList.value.length && !versionList.value.includes(componentStore.version)) {
      const [latestVersion] = versionList.value;
      componentStore.version = latestVersion;
    }
  } catch (error) {
    console.error(error);
  }
};

const handleInit = async () => {
  try {
    componentStore.isLoadingNavGroups = true;
    // 设置 navGroups
    const navGroups = await getNavGroups(componentStore.version);

    navGroups.componentGroupMap = sortGroupByOrder(navGroups.componentGroupMap);
    componentStore.navGroups = navGroups;

    renderList.value = [...componentStore.componentMetaList];

    updateStateByRoute();
    await nextTick(scrollToCurNavItem);
  } catch (error) {
    console.error(error);
  } finally {
    componentStore.isLoadingNavGroups = false;
  }
};

const sortGroupByOrder = (data: INavGroups['componentGroupMap']) => {
  const sortedObj: INavGroups['componentGroupMap'] = {};
  const desiredOrder  = ['基础', '布局', '导航', '表单', '数据', '反馈'];
  desiredOrder.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      sortedObj[key] = data[key];
    }
  });

  return sortedObj;
};

const scrollToCurNavItem = () => {
  if (!asideNavGroupRef.value) return;

  const curAsideNavGroupItem = asideNavGroupRef.value.querySelector('.aside-nav-group-item.active') as HTMLElement;
  if (curAsideNavGroupItem) {
    // 171 是距离顶部的距离，85 是留出多余的高度，不给 85 的话，会显得太顶到顶部了
    const top = curAsideNavGroupItem.offsetTop - SCROLL_OFFSET_TOP - SCROLL_PADDING;
    asideNavGroupRef.value.scrollTo({
      top,
    });
  }
};

const updateStateByRoute = () => {
  const { name } = route.params;
  const componentName = Array.isArray(name) ? name[0] : name;
  if (!componentName) return;

  // URL 倒推逻辑,防止子目录影响routerName
  const pathSegments = route.path.split('/')
    .map(segment => decodeURIComponent(segment))
    .filter(Boolean);
  const index = pathSegments.indexOf(componentName);
  const routerName = index > 0 ? pathSegments[index - 1] : 'component';

  const componentList = componentStore.componentMetaList;
  if (!componentList || componentList.length === 0) return;

  const component = componentList
    .filter(item => item.routerName === routerName)
    .find(item => item.componentWiki.name === componentName);

  if (!component) return;
  if (['component', 'directive'].includes(routerName)) {
    componentStore.activeComponentWiki = component.componentWiki;
  }

  activeName.value = `${routerName}:${componentName}`;
};

watch(
  () => route.path,
  updateStateByRoute,
);

watch(
  () => componentStore.version,
  (newVal) => {
    if (newVal) {
      // 版本变化时同步到 localStorage
      setStorage(VERSION_KEY, newVal);
    }
    handleInit();
  },
);

onBeforeMount(() => {
  // 初始化时从 localStorage 读取版本号，如果没有则存储当前版本
  const storedVersion = getStorage(VERSION_KEY);
  if (storedVersion) {
    componentStore.version = storedVersion;
  } else {
    // 进入时就存储当前版本（默认 'dev'）
    setStorage(VERSION_KEY, componentStore.version);
  }
  handleInit();
  getVersionList();
  addHotUpdateFunction(handleInit);
});

onBeforeUnmount(() => {
  removeHotUpdateFunction(handleInit);
});
</script>

<style lang="postcss" scoped>
.aside-nav {
  display: flex;
  flex-direction: column;
  width: 260px;
  height: 100%;
  background: #FFFFFF;
  border-right: 1px solid #DCDEE5;
}
.aside-nav-header {
  display: flex;
  align-items: center;
  padding: 16px;

  .aside-nav-header-logo {
    width: 16px;
    height: 16px;
  }

  .aside-nav-header-title {
    margin: 0 20px 0 5px;
    font-size: 14px;
    color: #313238;
  }

  .aside-nav-header-version {
    width: 70px;

    &:deep(.bk-input) {
      width: 70px;
      border: none;

      .bk-input--text{
        background: #F0F1F5;
        color: #4D4F56;
        font-weight: bold;
      }
    }
  }
}

.aside-nav-search-wrapper {
  padding: 0px 16px 4px 16px;

  .aside-nav-search-input {
    width: 100%;
  }

  .search-dropdown-list {

    .search-dropdown-list-wrapper {
      padding: 6px 0;
      margin: 0;
      overflow-y: auto;
      list-style: none;

      &::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }

      &::-webkit-scrollbar-thumb {
        height: 5px;
        background-color: #dcdee5;
        border-radius: 2px;
      }
    }

    .search-dropdown-list-item {
      position: relative;
      width: 100%;
      height: 32px;
      padding: 0 10px;
      font-size: 14px;
      line-height: 32px;
      color: #63656e;
      cursor: pointer;
      background-color: #fff;
      border-right: #c4c6cc;
      border-left: #c4c6cc;

      &:first-child {
        border-top: #c4c6cc;
      }

      &:last-child {
        border-bottom: #c4c6cc;
      }

      &:hover,
      &.cur {
        background-color: #e1ecff;
      }
    }
  }
}

.aside-nav-group {
  padding: 0 16px 16px;
  overflow: auto;

  .aside-nav-group-title {
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    color: #979BA5;
  }

  .aside-nav-group-item {
    padding: 0 8px;
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #313238;
  }

  .aside-nav-group-item.active {
    background-color: #F0F5FF;
    border-radius: 4px;
    color: #3A84FF;
  }
}

:deep(.bk-popover.bk-pop2-content) {
  padding: 0;
}
:deep(.search-dropdown-list-item em) {
  font-style: normal;
  color: #3a84ff !important;
}
</style>
