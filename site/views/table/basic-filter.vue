<template>
  <div>
    <div class="cell">
      <span
        class="title"
        style="margin-right: 20px"
      >默认过滤</span>
      <bk-button
        style="margin-right: 20px"
        @click="handleClear"
      >
        清理过滤条件
      </bk-button>
      <bk-button
        style="margin-right: 20px"
        @click="handleAdd"
      >
        添加过滤
      </bk-button>
      <bk-input
        v-model="filterValue"
        style="width: 120px"
      />
      <bk-table
        style="margin-top: 20px"
        :columns="columns1"
        :data="tableData"
        :pagination="pagination"
        :pagination-heihgt="60"
      />
    </div>
    <div
      class="cell"
      style="height: 300px"
    >
      <span class="title">自定义过滤</span>
      <bk-table
        :columns="columns1"
        :data="tableData"
        height="100%"
        :pagination="pagination"
        :pagination-heihgt="60"
        @dblclick="handleDblClick"
      />
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import { DATA_COLUMNS1, DATA_FIX_COLUMNS } from './options';
  const DATA_ROWS = new Array(Math.ceil(Math.random() * 100) + 100)
    .fill('')
    .map((_, index) => ({
      ip: `${index}--192.168.0.x`,
      source: ['QQ', 'WeiXin', 'Email', 'Telphone'][index % 4],
      status: '创建中',
      create_time: `2018-05-25 15:02:24.${index}`,
    }));
  export default defineComponent({
    components: {},
    data() {
      return {
        tableData: DATA_ROWS,
        columns: DATA_FIX_COLUMNS.map(item => ({ ...item })),
        columns1: [...DATA_COLUMNS1],
        pagination: { count: DATA_ROWS.length, limit: 10 },
        filterValue: '',
        settings: {
          fields: [],
          checked: [],
        },
      };
    },
    mounted() {
      setTimeout(() => {
        this.settings.checked.push('index');
        this.settings.fields.push(...[
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
      // this.columns1[2].filter.list.length = 0;
      // for (let i = 0; i < 50; i++) {
      //   this.columns1[2].filter.list.push({ text: i + 1, value: i + 1 });
      // }
      }, 1000);
    },
    methods: {
      handleAdd() {
        this.columns1[2].filter.checked = [this.filterValue];
      },
      handleClear() {
        this.columns1[2].filter.checked.length = 0;
      },
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
  margin: 0px 5px 20px 5px;
}
</style>
