<template>
  <section class="edit-component-config g-scrollbar">
    <div class="prl16">
      <Header class="header-wrapper" @refresh="resetProp" />
      <Search
        :props="props.props"
        @selected-attr="handleSelectedAttr"
      />
      <div class="config-tabs">
        <div v-for="item in TABS" :key="item.id" @click="changeTab(item.id)" :class="`${activeTab === item.id ? 'active' : ''}`">{{ item.name }}</div>
      </div>
    </div>
    <Collapse title="属性">
      <div class="prl16" v-if="comProps.length">
        <DynamicConfigItem
          v-for="prop in comProps"
          :key="prop.name"
          :name="prop.name"
          :type="prop.type"
          :model-value="renderCamelKeyProps(prop.name)"
          :options="prop.options"
          :complex-types="types"
          :class="{ 'selected-prop': selectedProp === prop.name }"
          @update:model-value="(value) => handleUpdateProps(prop.name, value)"
        >
          <template #nameTip>
            <RenderNameTip :attr="prop" />
          </template>
        </DynamicConfigItem>
      </div>
      <Empty v-else />
    </Collapse>
    <Collapse title="插槽">
      <div class="prl16" v-if="comSlots.length">
        <Slot
          v-for="slot in comSlots"
          :slot-name="slot.name"
          :desc="slot.description"
          :model-value="renderSlots[slot.name]"
          @update:model-value="(value) => handleUpdateSlots(slot.name, value)" />
      </div>
      <Empty v-else />
    </Collapse>
  </section>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue';

import type {
  IComponentWiki,
  PropItem,
  ValueType as PropValue,
} from '@/types/component';

import DynamicConfigItem from '../dynamic-config-item';
import { factType, splitType } from '../dynamic-config-item/utils';
import { filterXss } from '@blueking/xss-filter';
import { camelKey, camelToSnakeCase } from '@/utils'

import Collapse from './collapse';
import Header from './header.vue';
import RenderNameTip from './name-tip';
import Search from './search.vue';
import Slot from './slot';
import Empty from './empty.vue';

interface IProps {
  props?: IComponentWiki['props'];
  presetProps?: IComponentWiki['presets'][number]['props'];
  renderProps?: IComponentWiki['presets'][number]['props'];
  types?: IComponentWiki['types'];
  renderSlots: IComponentWiki['presets'][number]['slots'];
  presetSlots: IComponentWiki['presets'][number]['slots'];
  slots: IComponentWiki['slots'];
}
interface IEmits {
  (e: 'update:renderProps', value: IComponentWiki['presets'][number]['props']): void;
  (e: 'update:renderSlots', value: IComponentWiki['presets'][number]['slots']): void;
}

const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();

const handleUpdateProps = (name: string, value: PropValue) => {
  emits(
    'update:renderProps',
    {
      ...props.renderProps,
      [name]: filterXss(value),
    },
  );
};
const handleUpdateSlots = (name: string, value: string) => {
  emits(
    'update:renderSlots',
    {
      ...props.renderSlots,
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
  },
];
const activeTab = ref(TABS[1].id);
const selectedProp = ref<string>('');
let highlightTimer: NodeJS.Timeout | null = null;

const changeTab = (id: string) => {
  activeTab.value = id;
};
const isSelectedPreset = (name: string) => {
  return Object.keys(props.presetProps).includes(name);
};
const handleSelectedAttr = (item: PropItem) => {
  if (isSelectedPreset(item.name)) {
    activeTab.value = TABS[1].id;
  } else {
    activeTab.value = TABS[0].id;
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
        block: 'center',
      });
    }
  }, 100);
};

const propsSort = <T extends { name: string }>(filterProps: T[]) => {
  return [...filterProps].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
};
const filterPropSlots = <T extends { name: string }, U extends object>(all: T[], preset: U) => {
  if (activeTab.value === 'all') {
    return propsSort(all);
  }
  const currentPropSlots: T[] = [];
  Object.keys(preset).forEach((key) => {
    const filterProps = all.filter(item => camelKey(item.name) === camelKey(key));
    currentPropSlots.push(...filterProps);
  });
  return propsSort(currentPropSlots);
};
// 暂未支持的可配置过滤掉
const filterErrTypeProps = () => {
  const partValidTypeProps = (props.props ?? []).filter((item: PropItem) => {
    const typeArr = splitType(item.type);
    const factTypeList = typeArr.map((typeVal) => {
      return factType(typeVal, item.options, props.types);
    });
    return !factTypeList.every(factType => factType === 'errortype');
  });
  return partValidTypeProps.map((item: PropItem) => {
    const typeArr = splitType(item.type);
    if (typeArr.length === 1) {
      return item;
    }
    const validTypes = typeArr.filter((typeValF) => {
      const curFactType = factType(typeValF, item.options, props.types);
      return curFactType !== 'errortype';
    });
    item.type = validTypes.join(' |');
    return item;
  });
};
const comProps = computed(() => {
  const allValidTypeProps = filterErrTypeProps();
  return filterPropSlots(allValidTypeProps, props.presetProps ?? {});
});
const comSlots = computed(() => {
  return filterPropSlots(props.slots ?? [], props.presetSlots ?? {});
});

const renderCamelKeyProps = (key: string) => {
  const renderVal = props.renderProps[key]
  if(typeof renderVal === 'undefined') {
    if(key.includes('-')) {
      return props.renderProps[camelKey(key)]
    } else {
      return props.renderProps[camelToSnakeCase(key)]
    }
  }
  return renderVal
}

const resetProp = () => {
  emits('update:renderProps', { ...props.presetProps });
};

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
  padding-top: 11px;
  overflow-y: auto;
  .prl16 {
    padding: 0 16px;
  }
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
