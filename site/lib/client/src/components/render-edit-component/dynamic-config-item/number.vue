<template>
  <bk-input
    class="config-item-number"
    type="number"
    :model-value="modelValue"
    behavior="simplicity"
    :disabled="disabled"
    @update:model-value="handleUpdateModelValue"
  />
</template>

<script lang="ts" setup>
import {
  Input as BkInput,
} from 'bkui-vue';

interface IProps {
  modelValue: number;
  disabled?: boolean;
}
interface IEmits {
  (e: 'update:modelValue', value: number): void;
}

defineProps<IProps>();
const emits = defineEmits<IEmits>();

const handleUpdateModelValue = (value: number) => {
  emits('update:modelValue', +value);
};
</script>
<style lang="postcss">
.config-item-number {
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
</style>