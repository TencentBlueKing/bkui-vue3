<template>
  <div class="row">
    <div class="cell">
      <bk-table
        :data="tableData"
      >
        <bk-table-column
          label="序号"
          type="index"
          sort
          :width="50"
          :min-width="80"
        />
        <bk-table-column
          label="名称/内网IP"
          field="ip"
          :width="100"
          :min-width="80"
        >
          <template #default="props">
            {{ props?.data }}
          </template>
        </bk-table-column>
      </bk-table>
    </div>
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
