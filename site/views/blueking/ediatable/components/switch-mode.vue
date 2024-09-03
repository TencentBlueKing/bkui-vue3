<template>
  <Loading :loading="isLoading">
    <SelectColumn
      ref="selectRef"
      v-model="localValue"
      :list="selectList"
      placeholder="请选择"
      :rules="rules"
      @change="value => handleChange(value as string)"
    />
  </Loading>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { Loading } from 'bkui-vue';

  import { SelectColumn } from '@blueking/ediatable';

  interface Props {
    data?: string;
    isLoading?: boolean;
  }

  interface Exposes {
    getValue: () => Promise<string>;
  }

  enum OnlineSwitchType {
    USER_CONFIRM = 'user_confirm',
    NO_CONFIRM = 'no_confirm',
  }

  const props = withDefaults(defineProps<Props>(), {
    data: '',
    isLoading: false,
  });

  const selectRef = ref();
  const localValue = ref(props.data);

  const selectList = [
    {
      value: OnlineSwitchType.USER_CONFIRM,
      label: '需人工确认',
    },
    {
      value: OnlineSwitchType.NO_CONFIRM,
      label: '无需确认',
    },
  ];

  const rules = [
    {
      validator: (value: string) => Boolean(value),
      message: '请选择切换模式',
    },
  ];

  const handleChange = (value: string) => {
    localValue.value = value as OnlineSwitchType;
  };

  defineExpose<Exposes>({
    getValue() {
      return selectRef.value.getValue().then(() => localValue.value);
    },
  });
</script>
