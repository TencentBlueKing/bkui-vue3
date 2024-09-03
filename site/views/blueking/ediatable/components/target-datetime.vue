<template>
  <Loading :loading="isLoading">
    <DateTimePickerColumn
      ref="editRef"
      append-to-body
      class="render-box"
      clearable
      :disabled-date="disableDate"
      :model-value="dateValue"
      placeholder="请选择指定时间"
      :rules="rules"
      type="datetime"
      @change="handleDatetimeChange"
    />
  </Loading>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { Loading } from 'bkui-vue';

  import { DateTimePickerColumn } from '@blueking/ediatable';

  interface Props {
    data?: string;
    isLoading?: boolean;
  }

  interface Exposes {
    getValue: () => Promise<string>;
  }

  const props = withDefaults(defineProps<Props>(), {
    data: '',
    isLoading: false,
  });

  const editRef = ref();
  const dateValue = ref(props.data);

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

  const handleDatetimeChange = (date: string) => {
    dateValue.value = date;
  };

  defineExpose<Exposes>({
    getValue() {
      return editRef.value.getValue().then(() => dateValue.value);
    },
  });
</script>
<style lang="less" scoped>
  .render-box {
    :deep(.icon-wrapper) {
      left: 10px;
      display: block;
      width: 32px;
    }

    :deep(input) {
      padding-left: 40px;
    }
  }
</style>
