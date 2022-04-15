<template>
  <div style="height: 300px; width: 100%">
    <bk-table
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import { DATA_COLUMNS } from './options';
  const DATA_ROWS = new Array(Math.ceil(Math.random() * 9000) + 1000).fill('')
    .map((_, index) => ({
      ip: `${index}--192.168.0.x`,
      source: `${index}_QQ`,
      status: '创建中',
      create_time: `2018-05-25 15:02:24.${index}`,
    }));

  export default defineComponent({
    components: {},
    data() {
      return {
        tableData: DATA_ROWS,
        columns: [...DATA_COLUMNS],
        pagination: { count: 100, limit: 20 },
      };
    },
  });
</script>
