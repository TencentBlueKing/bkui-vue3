<template>
  <div class="config-item-array">
    <div v-if="modelValue.length">
      <div v-for="(arrItem, arrIndex) in modelValue" :key="`${arrIndex}-${arrItem}`">
        <div class="item-first-row">
          <span class="expand" @click="expandArrayItem(arrIndex)">
            <i v-if="expandIndex === getLevelNo(arrIndex)" class="bkui-vue-wiki-icon icon-angle-up-fill"></i>
            <i v-else class="bkui-vue-wiki-icon icon-angle-right-fill"></i>
          </span>
          <div class="index-remove">
            <span>{{ getLevelNo(arrIndex) }}</span>
            <span class="remove" @click="removeArrayItem(arrIndex)">
              <i class="bkui-vue-wiki-icon icon-reduce"></i>
            </span>
          </div>
        </div>
        <div :class="{'no-expand': true, 'expand-content': expandIndex === getLevelNo(arrIndex)}">
            <DynamicConfigItem
              v-for="(item, index) in arrayItemConfig"
              :key="`${index}-${item}`"
              :name="item.name"
              :type="item.type"
              :model-value="safeModelValue[arrIndex][item.name]"
              :options="item.options"
              :complex-types="complexTypes"
              :parent-no="getLevelNo(arrIndex)"
              @update:model-value="(value) => handleUpdateArrItemValue(arrIndex, item.name, value)"
            >
              <template #nameTip>
                <RenderNameTip :attr="item" />
              </template>
            </DynamicConfigItem>
          <template v-if="basicType">
            <DynamicConfigItem
              :type="basicType"
              name=""
              :model-value="modelValue[arrIndex]"
              @update:model-value="(value) => handleUpdateArrItemValue(arrIndex, '', value)"
            />
          </template>
        </div>
      </div>
    </div>
    <div class="add" @click="addArrayItem">
      <i class="bkui-vue-wiki-icon icon-add"></i>
      <span>添加 {{ name }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, type PropType } from 'vue';
import type { ValueType, IComponentWiki } from '@/types/component';

import DynamicConfigItem from '../dynamic-config-item';
import RenderNameTip from '../config/name-tip';

import { factType } from './utils';

const props = defineProps({
  modelValue: {
    type: Array as PropType<Array<Record<string, ValueType> | string | number | boolean>>,
    default: () => [],
  },
  name: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    required: true,
  },
  // options 仅在 数据类型 为 enum 时有效
  options: {
    type: Array as PropType<IComponentWiki['props'][number]['options']>,
    default: () => [],
  },
  complexTypes: {
    type: Array as PropType<IComponentWiki['types']>,
    default: () => [],
  },
  parentNo: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const arrayItemConfig = computed(() => {
  const { type, complexTypes } = props;
  const arrItem = complexTypes.find(item => item.name === type.trim());
  if(arrItem) {
    return arrItem.fields
  }
  return []
});

const expandIndex = ref<string>('');

const getLevelNo = (index: number) => {
  const indexNo = index + 1;
  if(props.parentNo === '') {
    return `${indexNo}`;
  }
  return `${props.parentNo}-${indexNo}`;
};
const expandArrayItem = (index: number) => {
  const levelNo = getLevelNo(index);
  if(levelNo === expandIndex.value) {
    expandIndex.value = '';
    return;
  }
  expandIndex.value = levelNo;
}
const removeArrayItem = (index: number) => {
  const newModelValue = JSON.parse(JSON.stringify(props.modelValue));
  newModelValue.splice(index, 1);
  emit('update:modelValue', newModelValue);
  expandArrayItem(0);
}
const getTypeToDefault = (type: string, defaultVal: ValueType) => {
  switch(factType(type, props.options, props.complexTypes)) {
    case 'string':
      return defaultVal ?? '';
    case 'number':
      return defaultVal ?? 0;
    case 'boolean':
      return defaultVal ?? false;
    case 'array':
      return defaultVal ?? [];
    case 'object':
      return defaultVal ?? {};
    default:
      return null;
  }
}
const basicType = ref(null)
const getArrBasicDefVal = (type: string): string | number | boolean | Array<unknown> => {
  const basicTypeArr = type.toLowerCase();
  if(basicTypeArr === 'string[]') {
    basicType.value = 'string';
    return '';
  }
  if(basicTypeArr === 'number[]') {
    basicType.value = 'number';
    return 0;
  }
  if(basicTypeArr === 'boolean[]') {
    basicType.value = 'boolean';
    return false;
  }
  return [];
}
const addArrayItem = () => {
  const newModelValue = JSON.parse(JSON.stringify(props.modelValue));
  if(!arrayItemConfig.value.length) {
    const itemDefVal = getArrBasicDefVal(props.type);
    if(Array.isArray(itemDefVal)) {
      return;
    }
    newModelValue.push(itemDefVal);
  } else {
    const newModelValueItem: Record<string, ValueType> = {};
    arrayItemConfig.value.forEach((item) => {
      newModelValueItem[item.name] = getTypeToDefault(item.type, item.default);
    });
    newModelValue.push(newModelValueItem);
  }
  emit('update:modelValue', newModelValue);
  expandArrayItem(newModelValue.length - 1);
}
const handleUpdateArrItemValue = (arrIndex: number, name: string, value: any) => {
  const newModelValue = JSON.parse(JSON.stringify(props.modelValue));
  if(!name) {
    newModelValue[arrIndex] = value;
  } else {
    newModelValue[arrIndex][name] = value;
  }
  emit('update:modelValue', newModelValue);
}
const safeModelValue = computed(() => {
  return props.modelValue.filter(
    (arrItem): arrItem is Record<string, ValueType> =>
      typeof arrItem === 'object' && arrItem !== null && !Array.isArray(arrItem)
  );
});
</script>
<style lang="postcss" scoped>
.config-item-array {
  font-size: 12px;
  .item-first-row {
    display: flex;
    align-items: center;
    .expand {
      cursor: pointer;
      & > i {
        color: #4D4F56;
      }
    }
    .index-remove {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 24px;
      padding-left: 8px;
      margin-left: 5px;
      .remove {
        display: none;
        margin-right: 5px;
        cursor: pointer;
        .icon-reduce {
          font-size: 14px;
          color: #EA3636;
        }
      }
      &:hover {
        background-color: #F0F1F5;
        border-radius: 2px;
        .remove {
          display: block;
        }
      }
    }
  }

  .no-expand {
    display: none;
  }
  .expand-content {
    display: block;
    padding-left: 14px;
    border-left: 1px solid #DCDEE5;
    margin-left: 6px;
  }
  .add {
    display: flex;
    align-items: center;
    color: #3A84FF;
    cursor: pointer;
    .icon-add {
      font-size: 14px;
      margin-right: 5px;
    }
  }
}
</style>
