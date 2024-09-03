<template>
  <TextPlainColumn
    ref="textRef"
    :data="localValue"
    placeholder="自动生成"
    :rules="rules"
  />
  <Button
    style="width: 88px; margin-top: 16px;margin-right: 10px;"
    @click="handleSetValue"
  >
    生成值
  </Button>
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
  import { TextPlainColumn } from '@blueking/ediatable';

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
  const textRef = ref();

  const rules = [
    {
      validator: (value: string) => !!value,
      message: '不能为空',
    },
  ];

  const handleSetValue = () => {
    localValue.value = '这是测试字符串'
  }

  const handleGetValue = () => {
    textRef.value.getValue().then(() => {
      console.log('值：', localValue.value);
    })
  };

  defineExpose<Exposes>({
    getValue() {
      return textRef.value.getValue().then(() => localValue.value);
    },
  });
</script>
