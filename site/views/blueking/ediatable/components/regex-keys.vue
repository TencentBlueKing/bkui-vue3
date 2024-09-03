<template>
  <TagInputColumn
    ref="editTagRef"
    :model-value="localValue"
    placeholder="请输入正则表达式"
    :rules="rules"
    show-tip
    @change="handleChange"
  >
    <template #tip>
      <p style="font-weight: bold">
        可使用通配符进行提取，如
      </p>
      <p>*Key$ ：提取以 Key 结尾的 key，包括 Key</p>
      <p>^Key$：提取精确匹配的Key</p>
      <p>* ：代表所有'</p>
    </template>
  </TagInputColumn>
</template>
<script setup lang="ts">
  import { ref } from 'vue';

  import { TagInputColumn } from '@blueking/ediatable';

  interface Props {
    data?: string[];
    required?: boolean;
  }
  interface Emits {
    (e: 'change', value: string[]): void;
  }
  interface Exposes {
    getValue: () => Promise<string[]>;
  }

  const props = withDefaults(defineProps<Props>(), {
    data: () => [],
    required: false,
  });

  const emits = defineEmits<Emits>();

  const rules = [
    {
      validator: (value: string[]) => {
        if (!props.required) {
          return true;
        }
        return value && value.length > 0;
      },
      message: '不能为空',
    },
  ];

  const editTagRef = ref();
  const localValue = ref(props.data);

  const handleChange = (value: string[]) => {
    if (value.includes('*') && value.length > 1) {
      // 已经输入默认全部，不能继续输入其他字符
      localValue.value = ['*'];
    }
    emits('change', value);
  };

  defineExpose<Exposes>({
    getValue() {
      return editTagRef.value.getValue(localValue.value);
    },
  });
</script>
