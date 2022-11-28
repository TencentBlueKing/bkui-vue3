<template>
  <div class="row">
    <bk-table
      :data="tableData"
      :settings="settings"
      border="horizontal"
    >
      <bk-table-column
        label="序号"
        type="index"
        sort
        :width="50"
      />
      <bk-table-column
        label="名称/内网IP"
        prop="ip"
      >
        <template #default="props">
          {{ props?.data.ip }}
        </template>
      </bk-table-column>
      <bk-table-column
        label="来源"
        prop="source"
      />
      <bk-table-column
        label="创建时间"
        prop="create_time"
      />
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

