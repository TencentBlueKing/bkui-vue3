<template>
  <SelectColumn
    ref="selectRef"
    v-model="localValue"
    style="height: 42px;"
    :list="selectList"
    placeholder="请选择"
    :rules="rules"
  />
  <Button
    style="width: 88px; margin-top: 16px"
    theme="primary"
    @click="handleGetValue"
  >
    获取值
  </Button>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { Button } from 'bkui-vue';
  import { SelectColumn } from '@blueking/ediatable';

  interface Props {
    data?: string;
  }

  interface Exposes {
    getValue: () => Promise<string>;
  }

  const props = withDefaults(defineProps<Props>(), {
    data: '',
  });

  const selectRef = ref();
  const localValue = ref(props.data);

  const selectList = [
    {
      value: 'user_confirm',
      label: '需人工确认',
    },
    {
      value: 'no_confirm',
      label: '无需确认',
    },
  ];

  const rules = [
    {
      validator: (value: string) => !!value,
      message: '请选择',
    },
  ];

  const handleGetValue = () => {
    selectRef.value.getValue().then(() => {
      console.log('值：', localValue.value);
    })
  };

  defineExpose<Exposes>({
    getValue() {
      return selectRef.value.getValue().then(() => localValue.value);
    },
  });
</script>
