<template>
  <bk-search-select
    v-model="value"
    :data="data"
    :validate-values="validateValues"
  />
</template>
<script setup>
  import { ref } from 'vue';
  const data = [
    {
      name: '实例状态',
      id: '1',
      multiple: true,
      placeholder: '请选择/请输入',
      children: [
        {
          name: '创建中',
          id: '1-2',
        },
        {
          name: '运行中',
          id: '1-3',
          disabled: false,
        },
        {
          name: '已关机',
          id: '1-4',
        },
      ],
    },
    {
      name: '实例业务',
      id: '2',
      placeholder: '输入格式为XXX',
      children: [
        {
          name: '王者荣耀',
          id: '2-1',
          disabled: false,
        },
        {
          name: '刺激战场',
          id: '2-2',
        },
        {
          name: '绝地求生',
          id: '2-3',
        },
      ],
    },
    {
      name: 'IP地址',
      id: '3',
      placeholder: '输入格式为XXX.XXX.XXX',
    },
    {
      name: '实例名',
      id: '4',
    },
    {
      name: '实例地址',
      id: '5',
    },
    {
      name: '测试六',
      id: '6',
    },
  ];
  const value = ref([]);
  const validateValues = async (item, values) => {
    console.info(item, values);
    return !item ? '格式错误' : true;
  };
</script>
