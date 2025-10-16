<template>
  <bk-select
    class="config-item-enum"
    v-model="switcherValue"
    behavior="simplicity"
    theme="primary"
    :clearable="clearable"
  >
    <BkSelect.Option
      v-for="option in options"
      :key="option"
      :id="option"
      :label="option"
    />
  </bk-select>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Select as BkSelect } from 'bkui-vue';

import type { IComponentWiki } from '@/types/component';


interface IProps {
  modelValue: string;
  clearable?: boolean;
  options: IComponentWiki['props'][number]['options']
}
interface IEmits {
  (e: 'update:modelValue', value: string): void;
}

const props = withDefaults(defineProps<IProps>(), {
  clearable: true,
});
const emits = defineEmits<IEmits>();

const switcherValue = ref(props.modelValue);
watch(switcherValue, (value) => {
  emits('update:modelValue', value);
});
</script>
<style lang="postcss">
.config-item-enum {
  .bk-input {
    height: 22px;
  }
  &.bk-select.is-focus .bk-input.is-simplicity .bk-input--text {
    background-color: #FFFFFF;
  }
  .bk-input.is-simplicity:hover:not(.is-disabled) {
    background-color: #FFFFFF;
  }
  .bk-input.is-simplicity:hover:not(.is-disabled) .bk-input--text {
    background-color: #FFFFFF;
  }
  .bk-input.is-simplicity {
    border-bottom-color: #DCDEE5;
  }
  .bk-input--text {
    padding-left: 0;
  }
}
</style>
