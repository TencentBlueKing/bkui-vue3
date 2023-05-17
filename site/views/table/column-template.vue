<template>
  <bk-button @click="() => handleHideColumn(2)">
    点击显示列2
  </bk-button>
  <bk-button @click="() => handleHideColumn(3)">
    点击显示列3
  </bk-button>
  <bk-button @click="() => handleHideColumn(4)">
    点击显示列4
  </bk-button>
  <div class="row">
    <bk-table
      :data="tableData"
      show-overflow-tooltip
      border="horizontal"
    >
      <template
        v-for="(col, index) in showColumns"
        :key="index"
      >
        <bk-table-column
          :label="col.label"
          :type="col.type"
          :prop="col.field"
        />
      </template>
    </bk-table>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import { DATA_COLUMNS, DATA_TABLE } from './options';
  export default defineComponent({
    data() {
      return {
        tableData: [...DATA_TABLE],
        columns: DATA_COLUMNS.map(col => ({ ...col, isShow: true })),
        showZSource: false,
        settings: {
          fields: [],
          checked: [],
        },
      };
    },
    computed: {
      showColumns() {
        return this.columns.filter(item => item.isShow);
      },
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
      }, 1000);
    },
    methods: {
      handleHideColumn(index) {
        this.columns[index].isShow = !this.columns[index].isShow;
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
    flex: 1;
    margin: 0 5px 0 5px;
  }
  </style>

