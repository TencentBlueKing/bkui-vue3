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
        @row-click="handleRowClick"
      >
        <template #expandContent>
          <span>Content</span>
        </template>

        <template #expandRow>
          <span>Row Content</span>
        </template>
      </bk-table>
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
      handleRowClick(e, row) {
        console.log('handleRowClick', row);
        row.priority = row.priority + 1;
      },
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
