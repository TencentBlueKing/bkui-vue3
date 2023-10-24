<template>
  <div style="width: 100%; height: 500px;">
    <bk-table
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :pagination-heihgt="60"
      height="100%"
    />
  </div>
</template>

<script setup>

  import { ref } from 'vue';

  import { DATA_FIX_COLUMNS } from './options';

  const tableData = new Array(Math.ceil(Math.random() * 9000) + 1000).fill('')
    .map((_, index) => ({
      ip: `${index}--192.168.0.x`,
      source: `${index}_QQ`,
      status: '创建中',
      create_time: `2018-05-25 15:02:24.${index}`,
    }));

  const pagination = ref({ count: tableData.length, limit: 10 });
  const columns = DATA_FIX_COLUMNS.map(item => ({ ...item }));
</script>
