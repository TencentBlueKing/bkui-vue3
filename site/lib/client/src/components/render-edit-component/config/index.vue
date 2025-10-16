<template>
  <section class="edit-component-config g-scrollbar">
    <Header class="header-wrapper" @refresh="resetProp"  />
    <Search 
      :props="props.props" 
      @selectedAttr="handleSelectedAttr"
    />
    <div class="config-tabs">
      <div v-for="item in TABS" :key="item.id" @click="changeTab(item.id)" :class="`${activeTab === item.id ? 'active' : ''}`">{{ item.name }}</div>
    </div>
    <DynamicConfigItem
      v-for="prop in comProps"
      :key="prop.name"
      :name="prop.name"
      :type="prop.type"
      :model-value="renderProps[prop.name]"
      :options="prop.options"
      :complex-types="types"
      :class="{ 'selected-prop': selectedProp === prop.name }"
      @update:model-value="(value) => handleUpdateProps(prop.name, value)"
    >
      <template #nameTip>
        <RenderNameTip :attr="prop" />
      </template>
    </DynamicConfigItem>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref, onBeforeUnmount } from 'vue';
import type {
  IComponentWiki,
  ValueType as PropValue,
} from '@/types/component';

import DynamicConfigItem from '../dynamic-config-item';
import RenderNameTip from './name-tip';
import Header from './header.vue';
import Search from './search.vue';

interface IProps {
  props: IComponentWiki['props'];
  presetProps: IComponentWiki['presets'][number]['props'];
  renderProps: IComponentWiki['presets'][number]['props'];
  types: IComponentWiki['types'];
}
interface IEmits {
  (e: 'update:renderProps', value: IComponentWiki['presets'][number]['props']): void;
}

const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();

const handleUpdateProps = (name: string, value: PropValue) => {
  emits(
    'update:renderProps',
    {
      ...props.renderProps,
      [name]: value,
    },
  );
};

const TABS = [
  {
    id: 'all',
    name: '全部配置',
  },
  {
    id: 'current',
    name: '当前场景',
  }
]
const activeTab = ref(TABS[1].id);
const selectedProp = ref<string>('');
let highlightTimer: NodeJS.Timeout | null = null;

const changeTab = (id: string) => {
  activeTab.value = id;
}
const isSelectedPreset = (name: string) => {
  return Object.keys(props.presetProps).includes(name);
}
const handleSelectedAttr = (item: IComponentWiki['props'][0]) => {
  if(isSelectedPreset(item.name)) {
    activeTab.value = TABS[1].id
  } else {
    activeTab.value = TABS[0].id
  }
  
  selectedProp.value = item.name;
  // 清除之前的定时器
  if (highlightTimer) {
    clearTimeout(highlightTimer);
  }
  // 设置新的定时器，3秒后清除高亮
  highlightTimer = setTimeout(() => {
    selectedProp.value = '';
    highlightTimer = null;
  }, 3000);
  
  // 滚动到选中的属性
  setTimeout(() => {
    const selectedElement = document.querySelector('.selected-prop');
    if (selectedElement) {
      selectedElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, 100);
}

const propsSort = (filterProps: IComponentWiki['props']) => {
  return [...filterProps].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  );
}
const comProps = computed(() => {
  if(activeTab.value === 'all') {
    return propsSort(props.props);
  } else {
    const currentProps: IComponentWiki['props'] = [];
    Object.keys(props.presetProps).forEach((key) => {
      const filterProps = props.props.filter(item => item.name === key);
      currentProps.push(...filterProps)
    });
    return propsSort(currentProps);
  }
});

const resetProp = () => {
  emits('update:renderProps', { ...props.presetProps });
}

// 组件卸载时清理定时器
onBeforeUnmount(() => {
  if (highlightTimer) {
    clearTimeout(highlightTimer);
    highlightTimer = null;
  }
});
</script>

<style lang="postcss" scoped>
.edit-component-config {
  background: #FFFFFF;
  box-shadow: -1px 0 0 0 #DCDEE5;
  height: 100%;
  padding: 11px 16px 0;
  overflow-y: auto;
  .header-wrapper {
    margin-bottom: 3px;
  }
  .config-tabs {
    display: flex;
    align-items: center;
    padding: 12px 0 8px 0;
    color: #4D4F56;
    div {
      flex: 1;
      border: 1px solid #C4C6CC;
      text-align: center;
      padding: 3px 0;
      cursor: pointer;
      &:hover {
        color: #3A84FF;
      }
    }
    div:first-child {
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
    }
    div:last-child {
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
      margin-left: -1px;
    }
    .active {
      color: #3A84FF;
      background-color: #E1ECFF;
      border-color: #3A84FF;
    }
  }

  /* 选中属性的高亮样式 */
  .selected-prop {
    background-color: #FDF4E8 !important;
    border-radius: 2px;
    transition: all 0.2s ease;
  }
}
</style>
