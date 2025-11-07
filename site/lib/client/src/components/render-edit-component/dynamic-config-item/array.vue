<template>
  <div class="config-item-array">
    <template v-if="!isNoConfigArr">
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
    </template>
    <div v-else>
      <bk-input
        v-model="arrVal"
        :rows="4"
        type="textarea"
        :class="{
          'is-error': hasError,
        }"
        @blur="validateArr"
      />
      <div v-if="hasError" class="error-message">{{ errMsg }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, watch, type PropType } from 'vue';
import type { ValueType, IComponentWiki } from '@/types/component';

import DynamicConfigItem from '../dynamic-config-item';
import RenderNameTip from '../config/name-tip';
import { Input as BkInput } from 'bkui-vue'

import { basicTypeToDefVal, factType, extractArrayGeneric, isGenericArrType, filterErrTypeProps } from './utils';

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

const arrVal = ref(JSON.stringify(props.modelValue, null, 2) || '')
const hasError = ref(false)
const errMsg = ref('')
const validateArr = () => {
  const val = arrVal.value.trim()
  try {
    const parseArr = JSON.parse(val)
    if(!Array.isArray(parseArr)) {
      hasError.value = true
      errMsg.value = '请输入有效的数组'
      return
    }
    hasError.value = false
    errMsg.value = ''
  } catch (error) {
    hasError.value = true
    errMsg.value = '数组JSON格式有误'
  }
}
watch(arrVal, () => {
  validateArr()
  if(!hasError.value) {
    emit('update:modelValue', JSON.parse(arrVal.value))
  }
})

const arrayItemConfig = computed(() => {
  const { type, complexTypes } = props;
  let newType = type
  if(isGenericArrType(newType)) {
    const genericType = extractArrayGeneric(newType)
    newType = genericType
  }
  const arrItem = complexTypes.find(item => {
    const trimType = newType.trim() 
    return item.name === trimType || `${item.name}[]` === trimType
  });
  if(arrItem) {
    return filterErrTypeProps(JSON.parse(JSON.stringify(arrItem.fields)), complexTypes)
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
  const factTypeVal = factType(type, props.options, props.complexTypes) as keyof typeof basicTypeToDefVal
  const typeToDefVal = basicTypeToDefVal[factTypeVal]
  return defaultVal ?? (typeToDefVal ?? null)
}
const basicType = computed(() => {
  let basicTypeArr = props.type.toLowerCase()
  if(isGenericArrType(props.type)) {
    const genericType = extractArrayGeneric(props.type)
    basicTypeArr = `${genericType.toLowerCase()}[]`
  }
  if(basicTypeArr === 'string[]') {
    return 'string';
  }
  if(basicTypeArr === 'number[]') {
    return 'number';
  }
  if(basicTypeArr === 'boolean[]') {
    return 'boolean';
  }
  return null;
})
const addArrayItem = () => {
  const newModelValue = JSON.parse(JSON.stringify(props.modelValue));
  if(!arrayItemConfig.value.length) {
    const itemDefVal = basicTypeToDefVal[basicType.value];
    if(typeof itemDefVal === 'undefined') {
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

const isNoConfigArr = computed(() => {
  return !arrayItemConfig.value.length && !basicType.value
})
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
    margin-top: 5px;
    .icon-add {
      font-size: 14px;
      margin-right: 5px;
    }
  }
}
.error-message {
  display: flex;
  align-items: center;
  margin-top: 4px;
  font-size: 12px;
  color: #EA3636;
  line-height: 16px;
}

/* 错误状态的输入框样式 */
:deep(.bk-textarea.is-error .bk-textarea--textarea) {
  border-color: #EA3636 !important;
  box-shadow: 0 0 0 2px rgba(234, 54, 54, 0.1) !important;
}

:deep(.bk-textarea.is-error .bk-textarea--textarea:focus) {
  border-color: #EA3636 !important;
  box-shadow: 0 0 0 2px rgba(234, 54, 54, 0.2) !important;
}
</style>
