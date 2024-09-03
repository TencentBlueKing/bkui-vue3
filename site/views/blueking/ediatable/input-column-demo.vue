<template>
  <InputColumn
    ref="editRef"
    v-model="localValue"
    placeholder="请输入集群"
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
  import { InputColumn } from '@blueking/ediatable';

  interface Props {
    data?: string;
  }

  interface Exposes {
    getValue: () => Promise<string>;
  }

  const props = withDefaults(defineProps<Props>(), {
    data: '',
  });

  const localValue = ref(props.data);
  const editRef = ref();

  const rules = [
    {
      validator: (value: string) => !!value,
      message: '不能为空',
    },
  ];

  const handleGetValue = () => {
    editRef.value.getValue().then(() => {
      console.log('值：', localValue.value);
    })
  };

  defineExpose<Exposes>({
    getValue() {
      return editRef.value.getValue().then(() => localValue.value);
    },
  });
</script>
