<template>
  <DateTimePickerColumn
    ref="editRef"
    append-to-body
    clearable
    :disabled-date="disableDate"
    v-model="localValue"
    placeholder="请选择指定时间"
    :rules="rules"
    type="datetime"
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
  import { DateTimePickerColumn } from '@blueking/ediatable';

  interface Props {
    data?: string;
  }

  interface Exposes {
    getValue: () => Promise<string>;
  }

  const props = withDefaults(defineProps<Props>(), {
    data: '',
  });

  const editRef = ref();
  const localValue = ref(props.data);

  const rules = [
    {
      validator: (value: string) => !!value,
      message: '请指定时间',
    },
  ];

  const disableDate = (date: Date) => {
    const now = Date.now();
    return date.valueOf() < now - 16 * 24 * 3600000 || date.valueOf() > now;
  };

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
