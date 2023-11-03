<template>
  <div>
    <div class="table-layout-demo">
      <bk-table
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        :pagination-heihgt="60"
        max-height="100%"
        is-flex
      />
    </div>
    <div class="table-layout-demo">
      <bk-table
        :columns="columns"
        :data="tableData.slice(0,4)"
        :pagination="pagination"
        :pagination-heihgt="60"
        max-height="100%"
        is-flex
      />
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import { DATA_FIX_COLUMNS  } from './options';
  const DATA_ROWS = new Array(Math.ceil(Math.random() * 100) + 100).fill('')
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
        columns: DATA_FIX_COLUMNS.map(item => ({ ...item })),
        pagination: { count: DATA_ROWS.length, limit: 10 },
      };
    },
  });
</script>
<style>
.table-layout-demo{
  width: 100%; height: 400px;padding: 12px;margin-bottom: 15px;border: 1px solid #ccc;
}
</style>
