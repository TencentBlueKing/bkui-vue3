<template>
  <TagInputColumn
    ref="editTagRef"
    v-model="localValue"
    placeholder="请输入"
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
  import { TagInputColumn } from '@blueking/ediatable';

  interface Props {
    data?: string[];
  }

  interface Exposes {
    getValue: () => Promise<string[]>;
  }

  const props = withDefaults(defineProps<Props>(), {
    data: () => [],
  });

  const editTagRef = ref();
  const localValue = ref(props.data);

  const rules = [
    {
      validator: (value: string[]) => value.length > 0,
      message: '不能为空',
    },
  ];

  const handleGetValue = () => {
    editTagRef.value.getValue().then(() => {
      console.log('值：', localValue.value);
    })
  };

  defineExpose<Exposes>({
    getValue() {
      return editTagRef.value.getValue(localValue.value);
    },
  });
</script>
