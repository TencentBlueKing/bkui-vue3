<template>
  <div class="max-height-demo">
    <bk-search-select
      v-model="value"
      :data="data"
      :max-height="120"
    />
  </div>
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
  const value = ref([
    { id: '3', name: 'IP地址', values: [{ id: 'ip-1', name: '10.0.0.1' }] },
    { id: '4', name: '实例名', values: [{ id: 'name-1', name: 'search-select-a' }] },
    { id: '5', name: '实例地址', values: [{ id: 'addr-1', name: 'sz-az-1' }] },
    { id: '6', name: '测试六', values: [{ id: 'test-1', name: 'alpha' }] },
    { id: '3', name: 'IP地址', values: [{ id: 'ip-2', name: '10.0.0.2' }] },
    { id: '4', name: '实例名', values: [{ id: 'name-2', name: 'search-select-b' }] },
  ]);
</script>
<style scoped>
  .max-height-demo {
    width: 180px;
  }
</style>
