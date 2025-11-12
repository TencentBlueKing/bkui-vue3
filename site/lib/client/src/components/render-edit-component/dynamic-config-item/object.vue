<template>
  <div class="object-input-wrapper">
    <RenderAutoHeightTextarea
      :height="200"
      v-model="objectVal"
      placeholder="请输入有效的JSON对象格式"
      :class="{
        'is-error': hasError,
      }"
    />
    <div v-if="hasError" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, type PropType } from 'vue';
import type { IComponentWiki } from '@/types/component';
import RenderAutoHeightTextarea from '../config/render-auto-height-textarea.vue';

import { factType, isString, isNumber, isBoolean, isArray, isObject } from './utils';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  type: {
    type: String,
    required: true,
  },
  complexTypes: {
    type: Array as PropType<IComponentWiki['types']>,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue']);

const objectVal = ref(JSON.stringify(props.modelValue, null, 2) || '');
const hasError = ref(false);
const errorMessage = ref('');
const isValidObject = ref(false);

watch(
  () => props.modelValue,
  (newVal) => {
    objectVal.value = JSON.stringify(newVal, null, 2) || '';
  },
  { deep: true }
);

// 监听输入值变化
watch(objectVal, (newVal) => {
  validateObject();
 if(isValidObject.value && !hasError.value) {
   emit('update:modelValue', JSON.parse(newVal));
 }
});
const keyConfigs = (typeName: string) => {
  const typeItem = props.complexTypes.find(item => item.name === typeName);
  return typeItem?.fields || [];
};
const keyValueTypeValid = (typeValue: string, value: unknown) => {
    if(typeValue === 'string' && !isString(value)) {
      return false;
    }
    if(typeValue === 'number' && !isNumber(value)) {
      return false;
    }
    if(typeValue === 'boolean' && !isBoolean(value)) {
      return false;
    }
    if(typeValue === 'array' && !isArray(value)) {
      return false;
    }
    if(typeValue === 'object' && !isObject(value)) {
      return false;
    }
    if(typeValue === 'errortype') {
      return false;
    }
    return true;
}
const isValidObjectFormat = (parse: object, typeName: string) => {
  const keyConfigItems = keyConfigs(typeName);
  if(keyConfigItems.length === 0) return true
  for (const [key, value] of Object.entries(parse)) {
    const keyCpnfigItem = keyConfigItems.find(item => item.name === key)
    // 是否存在未定义的键
    if(keyCpnfigItem === undefined) {
      return false;
    }
    // 值有多类型，默认不校验
    if(keyCpnfigItem.type.includes('|')) {
      return true
    }
    // 键值类型是否匹配
    const typeValue = factType(keyCpnfigItem.type, keyCpnfigItem.options);
    if(!keyValueTypeValid(typeValue, value)) {
      return false;
    }
    // 如果值是对象，递归检查其格式
    if(isObject(value)) {
      if(!isValidObjectFormat(value, keyCpnfigItem.type)) {
        return false;
      }
    }
    // 如果值是数组，检查数组元素类型
    if(typeValue === 'array' && Array.isArray(value) && value.length > 0) {
      const arrItemConfig = keyConfigs(keyCpnfigItem.type);
      if(arrItemConfig.length === 0) {
        return false;
      }
      for (const arrItem of value) {
        if(isObject(arrItem)) {
          if(!isValidObjectFormat(arrItem, keyCpnfigItem.type)) {
            return false;
          }
        }
        // 基本类型检查, 例如：[1, 2, 3] 或 ['a', 'b', 'c']
        // 嵌套数组类型暂不支持检查, 例如：[[1, 2], [3, 4]]
      }
    }
  }
  return true;
};

// 校验对象格式
// 必须是json格式对象，函数不允许
const validateObject = () => {
  const value = objectVal.value?.trim();
  
  if (!value) {
    clearError();
    return;
  }
  
  try {
    const parsed = JSON.parse(value);

    if(!isValidObjectFormat(parsed, props.type.trim())) {
      hasError.value = true;
      errorMessage.value = '对象内容格式有误，请检查输入内容';
      isValidObject.value = false;
      return;
    }
    
    // 检查是否为对象类型
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      hasError.value = true;
      errorMessage.value = '请输入有效的对象格式，不能是数组或其他类型';
      isValidObject.value = false;
      return;
    }
    
    // 验证通过
    hasError.value = false;
    errorMessage.value = '';
    isValidObject.value = true;
    
  } catch (error) {
    hasError.value = true;
    isValidObject.value = false;
    // 提供更详细的错误信息
    if (error instanceof SyntaxError) {
      const message = error.message;
      if (message.includes('Unexpected token')) {
        errorMessage.value = 'JSON格式错误：存在无效的字符或语法';
      } else if (message.includes('Unexpected end')) {
        errorMessage.value = 'JSON格式不完整：缺少引号、括号或逗号';
      } else if (message.includes('Unexpected number')) {
        errorMessage.value = 'JSON格式错误：数字格式不正确';
      } else {
        errorMessage.value = `JSON格式错误：${message}`;
      }
    } else {
      errorMessage.value = 'JSON格式错误：无法解析输入内容';
    }
  }
};

// 清除错误状态
const clearError = () => {
  hasError.value = false;
  errorMessage.value = '';
  isValidObject.value = false;
};

</script>

<style lang="postcss" scoped>
.object-input-wrapper {
  position: relative;
  width: 100%;
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
:deep(.is-error .bk-textarea) {
  border-color: #EA3636 !important;
}
</style>
