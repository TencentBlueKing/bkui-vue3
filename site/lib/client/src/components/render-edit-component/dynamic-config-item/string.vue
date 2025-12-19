<template>
  <bk-input
    class="config-item-string"
    :model-value="modelValue"
    behavior="simplicity"
    :disabled="disabled"
    :tooltipsOptions="{
      boundary: 'parent',
      extCls: 'config-string-tip-content g-scrollbar',
    }"
    @update:model-value="handleUpdateModelValue"
  />
</template>

<script lang="ts" setup>
import {
  Input as BkInput,
} from 'bkui-vue';
import { filterXss } from '@blueking/xss-filter';

interface IProps {
  modelValue: string;
  disabled?: boolean;
}
interface IEmits {
  (e: 'update:modelValue', value: string): void;
}

defineProps<IProps>();
const emits = defineEmits<IEmits>();

const handleUpdateModelValue = (value: string) => {
  emits('update:modelValue', filterXss(value));
};
</script>
<style lang="postcss">
.config-item-string {
  &.bk-input {
    height: 22px;
  }
  &.is-focused:not(.is-readonly).is-simplicity .bk-input--text {
    background-color: #FFFFFF;
  }
  &.is-simplicity:hover:not(.is-disabled) .bk-input--text {
    background-color: #FFFFFF;
  }
  &.is-simplicity:hover:not(.is-disabled){
    background-color: #FFFFFF;
  }
  &.is-simplicity{
    border-bottom-color: #DCDEE5;
  }
  .bk-input--text {
    padding-left: 0;
  }
}
.config-string-tip-content {
  max-height: 200px;
  /* overflow-y: scroll; */
  overflow: auto;
}
</style>