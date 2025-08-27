<template>
  <bk-input
    type="number"
    :model-value="props.modelValue"
    @update:model-value="handleUpdateModelValue"
  />
</template>

<script lang="ts" setup>
import {
  Input as BkInput,
} from 'bkui-vue';

interface IProps {
  modelValue: number;
}
interface IEmits {
  (e: 'update:modelValue', value: number): void;
}

const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();

const handleUpdateModelValue = (value: number) => {
  emits('update:modelValue', +value);
};
</script>
