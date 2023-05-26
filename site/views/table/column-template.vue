<template>
  <section class="x-table-wrapper">
    <div class="click-span">
      <span
        v-for="(val, index) in slotTable"
        :key="index"
        :class="val.showLine ? 'click-show' : ''"
        @click="clickShowLine(index)"
      >{{ val.label }}</span>
    </div>
    {{ dataTable }}
    -----------------------------
    {{ renderSlotTable.filter(table => table.showLine) }}
    <bk-table
      :data="dataTable"
    >
      <bk-table-column
        v-for="(val, index) in renderSlotTable.filter(table => table.showLine)"
        :key="index"
        :label="val.label"
        :prop="val.prop"
      />
    </bk-table>
  </section>
</template>

<script>
  export default {
    name: 'PocTable',

    props: {
      slotTable: {
        type: Array,
        default() {
          return [
            { label: '第一列', prop: 'prop1', sortable: false, builtIn: false },
            { label: '第二列', prop: 'prop2', sortable: false, builtIn: 'table' },
            { label: '第三列', prop: 'prop3', sortable: false, builtIn: false },
          ];
        },
      },
      dataTable: {
        type: Array,
        default() {
          return [
            { prop1: '1-1', prop2: { tp: '123', value: '12314234' }, prop3: '1-3' },
            { prop1: '2-1', prop2: [{ sorts: [{ label: 'tp', prop: 'tp' }, { label: 'value', prop: 'value' }], data: [{ tp: '123', value: '1234' }] }], prop3: '2-3' },
            { prop1: '3-1', prop2: [{ tp: '123', value: '12314234' }], prop3: '3-3' },
          ];
        },
      },
      buttonText: {
        type: String,
        default: '',
      },
      buttonTheme: {
        type: String,
        default: 'primary',
      },
    },
    data() {
      return {
        keyword: '',
        pagination: {
          current: 1,
          count: 0,
          limit: 10,
        },
        renderSlotTable: [],
      };
    },
    watch: {
      slotTable: {
        handler() {
          this.renderSlotTable = JSON.parse(JSON.stringify(this.slotTable)).map(res => ({
            ...res,
            showLine: true,
          }));
        },
        immediate: true,
        deep: true,
      },
      dataTable(val) {
        this.pagination.count = val.length;
        this.pagination.current = 1;
      },
    },
    created() {
      this.pagination.count = this.dataTable.length;
    },
    methods: {
      handlePageChange(page) {
        this.pagination.current = page;
      },
      handlelimitChange(page) {
        if (this.pagination.limit !== page) {
          this.pagination.limit = page;
        }
      },
      handleClick(val) {
        this.$emit('handle-click', val);
      },
      clickShowLine(val) {
        this.renderSlotTable[val].showLine = !this.renderSlotTable[val].showLine;
      },
    },
  };
</script>
