<template>
  <div class="row">
    <div class="cell">
      <span class="title">自动填充高度(默认)：height='auto'</span>
      <bk-table
        :columns="columns"
        :data="tableData"
        settings
        @dblclick="handleDblClick"
      />
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
        @dblclick="handleDblClick"
      />
    </div>
    <div class="cell">
      <span class="title">固定高度：height='number | number px'</span>
      <bk-table
        :columns="columns"
        :data="tableData"
        :height="300"
        settings
        @dblclick="handleDblClick"
      />
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import { DATA_COLUMNS, DATA_TABLE } from './options';
  export default defineComponent({
    components: {},
    data() {
      return {
        tableData: [...DATA_TABLE],
        columns: [...DATA_COLUMNS],
      };
    },
    methods: {
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
  margin: 0 5px 0 5px;
}
</style>
