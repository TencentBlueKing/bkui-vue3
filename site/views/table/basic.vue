<template>
  <div>
    <div style="margin-bottom: 12px;">
      <bk-checkbox v-model="stripe">斑马纹 (stripe)</bk-checkbox>
    </div>
    <bk-table
      :columns="columns"
      :data="tableData"
      :height="300"
      :stripe="stripe"
    />
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue';

  const stripe = ref(false);

  const columns = reactive([
    { label: '名称', field: 'name' },
    { label: '来源', field: 'source' },
    { label: '状态', field: 'status' },
    { label: '创建时间', field: 'createTime' },
  ]);

  const tableData = ref([
    { name: '服务器-01', source: '腾讯云', status: '运行中', createTime: '2025-01-15 10:30:00' },
    { name: '服务器-02', source: '阿里云', status: '已停止', createTime: '2025-02-20 14:22:00' },
    { name: '服务器-03', source: '腾讯云', status: '运行中', createTime: '2025-03-10 09:15:00' },
    { name: '服务器-04', source: 'AWS', status: '运行中', createTime: '2025-04-05 16:48:00' },
    { name: '服务器-05', source: '腾讯云', status: '维护中', createTime: '2025-05-18 11:30:00' },
    { name: '服务器-06', source: '华为云', status: '运行中', createTime: '2025-06-01 08:00:00' },
    { name: '服务器-07', source: '腾讯云', status: '已停止', createTime: '2025-06-12 17:35:00' },
    { name: '服务器-08', source: 'AWS', status: '运行中', createTime: '2025-07-03 13:20:00' },
    { name: '服务器-09', source: '阿里云', status: '维护中', createTime: '2025-07-20 09:45:00' },
    { name: '服务器-10', source: '腾讯云', status: '运行中', createTime: '2025-08-08 15:10:00' },
  ]);
</script>
