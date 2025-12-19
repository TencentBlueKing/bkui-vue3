<template>
  <div class="config-item-array">
    <template v-if="codeObjStr.length">
      <pre class="config-arr-item-func g-scrollbar">
        <code v-html="codeObjStr"></code>
      </pre>
    </template>
    <RenderAutoHeightTextarea
      v-else
      :height="200"
      v-model="arrVal"
      placeholder="请输入有效的JSON数组格式"
      :disabled="disabled"
      :class="{
        'is-error': hasError,
      }"
      @blur="validateArr"
    />
    <div v-if="hasError" class="error-message">{{ errMsg }}</div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, computed, type PropType } from 'vue';
import type { ValueType, CodeLanguages } from '@/types/component';

import RenderAutoHeightTextarea from '../config/render-auto-height-textarea.vue';
import { filterXss } from '@blueking/xss-filter';
import { jsonStrIsHasFunc, funcStrToFunc } from './utils'

const props = defineProps({
  modelValue: {
    type: Array as PropType<Array<Record<string, ValueType> | string | number | boolean>>,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const arrVal = ref()
const codeObjStr = ref('');
watch(
  () => props.modelValue,
  (newVal, preVal) => {
    arrVal.value = JSON.stringify(newVal, null, 2) || '';
    // 初始变化时，有函数代码格式，是否禁止编辑
    if(preVal === undefined) {
      if(jsonStrIsHasFunc(arrVal.value)) {
        codeObjStr.value = funcStrToFunc(arrVal.value, false)
      }
    }
  },
  { immediate: true, deep: true }
);

const filterXssArrVal = computed(() => {
  return filterXss(arrVal.value);
})

const isValidateArrJSON = ref(false)
const hasError = ref(false)
const errMsg = ref('')
const validateArr = () => {
  const val = filterXssArrVal.value.trim()
  try {
    const parseArr = JSON.parse(val)
    if(!Array.isArray(parseArr)) {
      isValidateArrJSON.value = false
      hasError.value = true
      errMsg.value = '请输入有效的数组'
      return
    }
    arrVal.value = JSON.stringify(parseArr, null, 2)
    isValidateArrJSON.value = true
    hasError.value = false
    errMsg.value = ''
  } catch (error) {
    isValidateArrJSON.value = false
    hasError.value = true
    errMsg.value = '数组JSON格式有误'
  }
}
watch(arrVal, () => {
  if(!hasError.value && isValidateArrJSON.value) {
    emit('update:modelValue', JSON.parse(filterXssArrVal.value))
  }
})
</script>
<style lang="postcss" scoped>
.config-item-array {
  font-size: 12px;
  .config-arr-item-func {
    font-size: 0;
    padding: 3px 8px;
    border-radius: 2px;
    min-height: 200px;
    max-height: 400px;
    background-color: #F5F7FA;
    overflow: auto;
    code {
        font-size: 12px;
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
:deep(.is-error .bk-textarea) {
  border-color: #EA3636 !important;
}
</style>
