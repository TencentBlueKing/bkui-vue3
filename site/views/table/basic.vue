<template>
  <div class="row">
    <div class="cell">
      <span class="title">自动填充高度(默认)：height='auto'</span>
      <bk-table
        :columns="columns"
        :data="tableData"
        @dblclick="handleDblClick"
        @column-sort="handleSortBy"
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
        @dblclick="handleDblClick"
      />
    </div>
    <div class="cell">
      <span class="title">固定高度：height='number | number px'</span>
      <bk-table
        :columns="columns"
        :data="tableData"
        :height="300"
        :settings="settings"
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
        settings: {
          fields: [],
          checked: [],
        },
      };
    },
    mounted() {
      setTimeout(() => {
        this.settings.checked.push('index');
        this.settings.fields.push(...[{
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
                                      }]);
      }, 1000);
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
  margin: 0 5px 0 5px;
}
</style>
