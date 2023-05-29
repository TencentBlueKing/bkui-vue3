<template>
  <div>
    <div class="cell">
      <span class="title">默认过滤: scope = current, match = fuzzy</span>
      <bk-table
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        @column-sort="handleSortBy"
      />
    </div>
    <div class="cell">
      <span class="title">filter scope = all, match = fuzzy,</span>
      <bk-table
        :columns="columns1"
        :data="tableData"
        :pagination="pagination"
        @dblclick="handleDblClick"
      />
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import { DATA_COLUMNS, DATA_COLUMNS1 } from './options';
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
        columns: [...DATA_COLUMNS],
        columns1: [...DATA_COLUMNS1],
        tableData: DATA_ROWS,
        pagination: { count: DATA_ROWS.length, limit: 10 },
      };
    },

    methods: {
      handleSortBy(arg) {
        console.log('handleSortBy', arg);
      },
      handleDblClick(...args) {
        console.log(args);
      },
    },
  });
</script>
<style scoped>
.row {
  display: flex;
  width: 100%;
}

.cell {
  flex: 1;
  margin: 0px 5px 20px  5px;
}
</style>
