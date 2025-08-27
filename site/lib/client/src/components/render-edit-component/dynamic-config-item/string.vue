<template>
  <bk-input
    :model-value="props.modelValue"
    @update:model-value="handleUpdateModelValue"
  />
</template>

<script lang="ts" setup>
import {
  Input as BkInput,
} from 'bkui-vue';

interface IProps {
  modelValue: string;
}
interface IEmits {
  (e: 'update:modelValue', value: string): void;
}

const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();

const handleUpdateModelValue = (value: string) => {
  emits('update:modelValue', value);
};
</script>
