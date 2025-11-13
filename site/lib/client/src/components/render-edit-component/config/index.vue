<template>
  <section
    class="edit-component-config"
  >
    <div class="prl16">
      <Header class="header-wrapper" @refresh="resetProp" />
      <Search
        :props="allValidTypeProps"
        @selected-attr="handleSelectedAttr"
      />
      <Tab
        :tabs="tabs"
        v-model:active-tab="activeTab"
        size="medium"
      />
    </div>
    <div
      class="config-content g-scrollbar"
      ref="configRef"
      @scroll="handleScroll"
    >
      <Collapse
        v-model:active-keys="activeKeys"
        title="属性"
        name="attr"
      >
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
      <Collapse
        :class="{ 'sticky-title': !activeKeys.includes('slot') }"
        v-model:active-keys="activeKeys"
        title="插槽" 
        name="slot"
        ref="slotRef"
        @expand="scrollToSlot"
      >
        <div class="prl16" v-if="comSlots.length">
          <Slot
            v-for="slot in comSlots"
            :name="slot.name"
            :description="slot.description"
            :params="slot.params"
            :model-value="renderSlots[slot.name]"
            @update:model-value="(value) => handleUpdateSlots(slot.name, value)" />
        </div>
        <Empty v-else />
      </Collapse>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch, nextTick } from 'vue';

import type {
  IComponentWiki,
  IProp,
  ValueType as PropValue,
} from '@/types/component';

import DynamicConfigItem from '../dynamic-config-item';
import { filterXss } from '@blueking/xss-filter';
import { camelKey, camelToSnakeCase } from '@/utils'
import { debounce } from '../dynamic-config-item/utils';

import Collapse from './collapse';
import Header from './header.vue';
import RenderNameTip from './name-tip';
import Search from './search.vue';
import Slot from './slot';
import Empty from './empty.vue';
import Tab, { type ITab } from './tab'

interface IProps {
  props?: IProp[];
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
  const newName = Object.keys(props.renderProps || {}).find((key) => camelKey(key) === camelKey(name) && key !== name);
  emits(
    'update:renderProps',
    {
      ...props.renderProps,
      [newName ?? name]: filterXss(value, {
        escapeHtml: (value: string) => value
      }),
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

const tabs: ITab[] = [
  {
    value: 'all',
    label: '全部配置',
  },
  {
    value: 'current',
    label: '当前场景',
  },
];
const activeTab = ref(tabs[1].value);
const selectedProp = ref<string>('');
let highlightTimer: NodeJS.Timeout | null = null;

const isSelectedPreset = (name: string) => {
  return Object.keys(props.presetProps).includes(name);
};
const handleSelectedAttr = (item: IProp) => {
  if(!activeKeys.value.includes('attr')) {
    activeKeys.value.push('attr')
  }
  if (isSelectedPreset(item.name)) {
    activeTab.value = tabs[1].value;
  } else {
    activeTab.value = tabs[0].value;
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

const propsSort = <T extends { name: string }>(filterProps: T[]): T[] => {
  return [...filterProps].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
};
const filterPropSlots = <T extends { name: string }, U extends object>(all: T[], preset: U): T[] => {
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
const allValidTypeProps = computed(() => {
  return JSON.parse(JSON.stringify(props?.props ?? []));
})
const comProps = computed(() => {
  return filterPropSlots(allValidTypeProps.value, props.presetProps ?? {});
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

const activeKeys = ref(['attr', 'slot'])
const configRef = ref()
const slotRef = ref()
const parentChildPos = () => {
  if(!configRef.value || !slotRef.value) return
  const parentTop = configRef.value.getBoundingClientRect().top
  const childEl = slotRef.value.$el
  const childRect = childEl.getBoundingClientRect()
  const childTop = childRect.top
  const childBottom = childRect.bottom
  return {
    parentTop,
    childTop,
    childBottom,
  }
}
const showSlot = () => {
  if(!configRef.value || !slotRef.value) return
  const { parentTop, childTop, childBottom } = parentChildPos()
  const isVisible = childTop - parentTop + 36 <= configRef.value.clientHeight || childBottom - parentTop < configRef.value.clientHeight
  if(!isVisible) {
    activeKeys.value = activeKeys.value.filter(item => item !== 'slot')
  }
}
const handleScroll = debounce(() => {
  showSlot()
}, 100)
watch(() => activeTab.value, () => {
  nextTick(() => {
    showSlot()
  })
}, { immediate: true })
const scrollToSlot = () => {
  nextTick(() => {
    if(!configRef.value || !slotRef.value) return
    const { parentTop, childTop } = parentChildPos()
    configRef.value.scrollTo({
      top: childTop - parentTop + configRef.value.scrollTop - 36,
      behavior: 'smooth',
    })
  })
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
  padding-top: 11px;
  display: flex;
  flex-direction: column;
  .prl16 {
    padding: 0 16px;
  }
  .header-wrapper {
    margin-bottom: 3px;
  }
  .config-tabs {
    padding: 12px 0 8px 0;
  }

  /* 选中属性的高亮样式 */
  .selected-prop {
    background-color: #FDF4E8 !important;
    border-radius: 2px;
    transition: all 0.2s ease;
  }
  .config-content {
    flex: 1;
    overflow-y: auto;
  }
  .sticky-title {
    position: sticky;
    bottom: 0;
    top: 36px;
    z-index: 2;
  }
}
</style>
