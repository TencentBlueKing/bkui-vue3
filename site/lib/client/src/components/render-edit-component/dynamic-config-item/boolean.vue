<template>
  <bk-switcher
    :model-value="modelValue"
    @update:model-value="handleUpdateModelValue"
    :true-value="true"
    :false-value="false"
    theme="primary"
    ext-cls="config-item-boolean"
  />
</template>
<script lang="ts" setup>
import { Switcher as BkSwitcher } from 'bkui-vue';

interface IProps {
  modelValue: boolean;
}
interface IEmits {
  (e: 'update:modelValue', value: boolean): void;
}

defineProps<IProps>();
const emits = defineEmits<IEmits>();

const handleUpdateModelValue = (value: string | boolean | number) => {
  emits('update:modelValue', value as boolean);
}

</script>
<style scoped lang="postcss">
.config-item-boolean {
height: 18px;
line-height: 18px;
&::after {
    width: 14px;
    height: 14px;
}
}
</style>
