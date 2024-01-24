<template>
  <div class="row">
    <bk-table
      :columns="columns"
      :data="tableData"
    />
  </div>
</template>

<script lang="jsx">
  import { random } from 'lodash';
  import { defineComponent } from 'vue';

  import { DATA_COLUMNS, DATA_TABLE } from './options';
  export default defineComponent({
    components: {},
    data() {
      return {
        isLoading: false,
        tableData: DATA_TABLE.map((d, index) => Object.assign({}, d, { msg: index * random(0, 20, true) })),
        dynamicColumn: 'create_time',
      };
    },
    computed: {
      columns() {
        return [{
          label: () => {
            /* eslint-disable */
            return <div style="display: flex; align-items: center;">
            <label>自定义组件：</label>
            <bk-select
              v-model={ this.dynamicColumn }
              filterable
              auto-focus>
              {
                DATA_COLUMNS.filter(col => !!col.field)
                  .map(col =>  <bk-option key={ col.field } value={ col.field } label={ col.field }>
                  </bk-option>)
              }
            </bk-select>
          </div>
          },
          field: this.dynamicColumn,
          sort: true,
        }, {
          label: () => '自定义字符串: 来源',
          field: 'source',
        }];
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
