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
          v-model="searchVal"
          type="search"
          clearable
          @input="handleSearch"
          @enter="handleChooseCom"
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
                  :key="item.componentWiki.name"
                  :class="[
                    'search-dropdown-list-item',
                    selectIndex === index ? 'cur' : ''
                  ]"
                  @click="handleChooseCom(item)"
                >
                  <span
                    v-html="`${item.componentWiki.title} ${item.componentWiki.titleCN}`
                      ?.replace(new RegExp(`(${searchVal})`, 'i'), '<em>$1</em>')"
                    class="text"
                  />
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
        :key="start.name"
        :class="{
          'aside-nav-group-item': true,
          active: start.name === activeName,
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
          :key="componentWiki.title"
          :class="{
            'aside-nav-group-item': true,
            active: componentWiki.name === activeName,
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
          :key="directive.name"
          :class="{
            'aside-nav-group-item': true,
            active: directive.name === activeName,
          }"
          @click="handleChoose(directive)"
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
          :key="customCom.name"
          :class="{
            'aside-nav-group-item': true,
            active: customCom.name === activeName,
          }"
          @click="handleChoose(customCom,'markdown')"
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

const startList = [{
  group: '开始',
  name: 'start',
  title: '',
  titleCN: '快速上手',
  description: '本组件库基于Vue3研发，本节介绍如何在项目中结合 webpack 一起使用 @blueking/bkui-vue。',
  presets: [],
}];

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
  scrollToCurNavItem();
  hidePopover();
  searchVal.value = '';
};

const handleChoose = async (value: IComponentWiki, routerName = 'component') => {
  if (routerName === 'component') {
    componentStore.activeComponentWiki = value;
  }
  activeName.value = value.name;
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
  } catch (error) {
    console.error(error);
  }
};

const handleInit = async () => {
  try {
    componentStore.isLoadingNavGroups = true;
    // 设置 navGroups
    const navGroups = await getNavGroups(componentStore.version);
    navGroups.startList = startList;

    navGroups.componentGroupMap = sortGroupByOrder(navGroups.componentGroupMap);
    componentStore.navGroups = navGroups;

    renderList.value = [...componentStore.componentMetaList];
    // 设置 activeComponentWiki
    const routeName = Array.isArray(route.params.name) ? route.params.name[0] : route.params.name;
    if (routeName) {
      const component = componentStore.componentMetaList
        .find(item => item.componentWiki.name === routeName);
      if (component) {
        componentStore.activeComponentWiki = component.componentWiki;
        activeName.value = component.componentWiki.name;
        await nextTick(scrollToCurNavItem);
      }
    }
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
  const curAsideNavGroupItem  = document.querySelector('.aside-nav-group-item.active');
  if (curAsideNavGroupItem) {
    // 171 是距离顶部的距离，85 是留出多余的高度，不给 85 的话，会显得太顶到顶部了
    asideNavGroupRef.value.scrollTop = (curAsideNavGroupItem as HTMLElement).offsetTop - 171 - 85;
  }
};

watch(
  () => route.params.name,
  (name) => {
    const nameValue = Array.isArray(name) ? name[0] : name;
    if (nameValue) {
      activeName.value = nameValue;
    }
  },
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
