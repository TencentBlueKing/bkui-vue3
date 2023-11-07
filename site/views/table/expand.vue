<template>
  <div>
    <div class="cell">
      <bk-button @click="handleSetAllRowExpand">
        展开|收起所有
      </bk-button>
      <bk-table
        ref="refTable1"
        :columns="columns"
        :data="tableData"
        @row-expand="handleRowExpand"
      >
        <template #expandRow="row">
          <div style="height: 80px">
            <div>ip: {{ row.ip }}</div>
            <div>source: {{ row.source }}</div>
            <div>status: {{ row.status }}</div>
            <div>create_time: {{ row.create_time }}</div>
          </div>
        </template>
      </bk-table>
    </div>
    <div
      class="cell"
      style="height: 300px;"
    >
      <span class="title">依赖父级高度：height='100%'</span>
      <bk-table
        :columns="columns"
        :data="tableData"
        height="100%"
        settings
      />
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import { DATA_EXPAND_COLUMNS, DATA_TABLE } from './options';
  export default defineComponent({
    components: {},
    data() {
      return {
        tableData: [...DATA_TABLE],
        columns: [...DATA_EXPAND_COLUMNS],
        isExpand: false,
      };
    },
    methods: {
      handleSetAllRowExpand() {
        this.isExpand = !this.isExpand;
        this.$refs.refTable1.setAllRowExpand(this.isExpand);
      },
      handleRowExpand({ row, column, index, rows, e }) {
        // 可以通过自定义逻辑，阻止事件冒泡
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();

        console.log('handleRowExpand', row, column, index, rows);
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
