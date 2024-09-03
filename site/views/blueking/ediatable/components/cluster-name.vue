<template>
  <InputColumn
    ref="editRef"
    v-model="localValue"
    placeholder="请输入集群"
    :rules="rules"
    @submit="handleInputFinish"
  />
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue';

  import { InputColumn } from '@blueking/ediatable';

  interface Props {
    data?: string;
  }

  interface Emits {
    (e: 'input-finish', value: string): void;
  }

  interface Exposes {
    getValue: () => Promise<string>;
  }

  const props = withDefaults(defineProps<Props>(), {
    data: '',
  });

  const emits = defineEmits<Emits>();

  const localValue = ref(props.data);
  const editRef = ref();

  const rules = [
    {
      validator: (value: string) => Boolean(value),
      message: '目标集群不能为空',
    },
  ];

  watch(
    () => props.data,
    data => {
      localValue.value = data;
    },
    {
      immediate: true,
    },
  );

  const handleInputFinish = (value: string) => {
    emits('input-finish', value);
  };

  defineExpose<Exposes>({
    getValue() {
      return editRef.value.getValue().then(() => localValue.value);
    },
  });
</script>
