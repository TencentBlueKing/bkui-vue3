<template>
  <div class="row">
    <div class="cell">
      <span class="title">Default filter</span>
      <bk-table
        :columns="columns"
        :data="tableData"
        :empty-text="'No data'"
        @dblclick="handleDblClick"
        @column-sort="handleSortBy"
      />
    </div>
    <div
      class="cell"
      style="height: 300px"
    >
      <span class="title">Custom filter</span>
      <bk-table
        :columns="columns1"
        :data="tableData"
        height="100%"
        @dblclick="handleDblClick"
      />
    </div>
  </div>
</template>

<script>
  import { defineComponent, onMounted, reactive } from 'vue';

  import { DATA_COLUMNS, DATA_COLUMNS1, DATA_TABLE } from '../../options';
  export default defineComponent({
    components: {},
    setup() {
      const settings = reactive({
        fields: [],
        checked: [],
      });

      onMounted(() => {
        setTimeout(() => {
          settings.checked.push('index');
          settings.fields.push(...[
            {
              label: '序号',
              field: 'index',
              disabled: true,
            },
            {
              label: '名称/内网IP',
              field: 'ip',
            },
            {
              label: '来源',
              field: 'source',
            },
            {
              label: '创建时间',
              field: 'create_time',
            },
          ]);
        }, 1000);
      });

      const handleSortBy = (arg) => {
        console.log('handleSortBy', arg);
      };

      const handleDblClick = (...args) => {
        console.log(args);
      };

      return {
        tableData: [...DATA_TABLE],
        columns: [...DATA_COLUMNS],
        columns1: [...DATA_COLUMNS1],
        settings,
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
