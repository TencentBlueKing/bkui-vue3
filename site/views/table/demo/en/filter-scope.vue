<template>
  <div class="row">
    <div class="cell">
      <span class="title">Default filter: scope = current, match = fuzzy</span>
      <bk-table
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        :empty-text="'No data'"
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
  import { defineComponent, reactive, ref } from 'vue';

  import { DATA_COLUMNS, DATA_COLUMNS1 } from '../../options';

  export default defineComponent({
    components: {},
    setup() {
      const DATA_ROWS = new Array(Math.ceil(Math.random() * 9000) + 1000)
        .fill('')
        .map((_, index) => ({
          ip: `${index}--192.168.0.x`,
          source: `${index}_QQ`,
          status: 'Creating',
          create_time: `2018-05-25 15:02:24.${index}`,
        }));
      const columns = ref([...DATA_COLUMNS]);
      const columns1 = ref([...DATA_COLUMNS1]);
      const tableData = ref([...DATA_ROWS]);
      const pagination = reactive({ count: DATA_ROWS.length, limit: 10 });

      const handleSortBy = (arg) => {
        console.log('handleSortBy', arg);
      };

      const handleDblClick = (...args) => {
        console.log(args);
      };

      return {
        columns,
        columns1,
        tableData,
        pagination,
        handleSortBy,
        handleDblClick,
      };
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
  margin: 0 5px 0 5px;
}
</style>
