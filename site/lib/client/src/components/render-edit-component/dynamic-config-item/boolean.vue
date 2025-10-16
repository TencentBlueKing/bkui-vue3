<template>
  <bk-switcher
    v-model="switcherValue"
    theme="primary"
    ext-cls="config-item-boolean"
  />
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Switcher as BkSwitcher } from 'bkui-vue';

interface IProps {
  modelValue: boolean;
}
interface IEmits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();

const switcherValue = ref(props.modelValue);
watch(switcherValue, (value) => {
  emits('update:modelValue', value);
});
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
