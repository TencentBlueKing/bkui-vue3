<template>
  <Loading :loading="isLoading">
    <InputColumn
      ref="editRef"
      v-model="localValue"
      :disabled="disabled"
      placeholder="请输入"
      :rules="rules"
      :min="0"
      type="number"
    />
  </Loading>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { Loading } from 'bkui-vue';

  import { InputColumn } from '@blueking/ediatable';

  interface Props {
    data?: number;
    min?: number;
    isLoading?: boolean;
    disabled?: boolean;
  }

  interface Exposes {
    getValue: () => Promise<number>;
  }

  const props = withDefaults(defineProps<Props>(), {
    data: 0,
    min: 0,
    isLoading: false,
    disabled: false,
  });

  const localValue = ref(String(props.data));
  const editRef = ref();

  const nonInterger = /\D/g;

  const rules = [
    {
      validator: (value: string) => Boolean(value),
      message: '目标台数不能为空',
    },
    {
      validator: (value: string) => !nonInterger.test(value),
      message: '格式有误，请输入数字',
    },
  ];

  defineExpose<Exposes>({
    getValue() {
      return editRef.value.getValue().then(() => Number(localValue.value));
    },
  });
</script>
