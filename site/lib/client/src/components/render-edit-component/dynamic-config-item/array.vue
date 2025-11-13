<template>
  <div class="config-item-array">
    <RenderAutoHeightTextarea
      :height="200"
      v-model="arrVal"
      placeholder="请输入有效的JSON数组格式"
      :class="{
        'is-error': hasError,
      }"
      @blur="validateArr"
    />
    <div v-if="hasError" class="error-message">{{ errMsg }}</div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, type PropType } from 'vue';
import type { ValueType } from '@/types/component';

import RenderAutoHeightTextarea from '../config/render-auto-height-textarea.vue';

const props = defineProps({
  modelValue: {
    type: Array as PropType<Array<Record<string, ValueType> | string | number | boolean>>,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue']);

const arrVal = ref(JSON.stringify(props.modelValue, null, 2) || '')
watch(
  () => props.modelValue,
  (newVal) => {
    arrVal.value = JSON.stringify(newVal, null, 2) || '';
  },
  { deep: true }
);
const isValidateArrJSON = ref(false)
const hasError = ref(false)
const errMsg = ref('')
const validateArr = () => {
  const val = arrVal.value.trim()
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
    emit('update:modelValue', JSON.parse(arrVal.value))
  }
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
:deep(.is-error .bk-textarea) {
  border-color: #EA3636 !important;
}
</style>
