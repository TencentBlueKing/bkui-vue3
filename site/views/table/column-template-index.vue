<template>
  <section>
    <bk-table
      :data="tableData"
    >
      <template
        v-for="column in columns"
        :key="column.label"
      >
        <bk-table-column
          :label="column.label"
          :type="column.type"
          :field="column.field"
          :index="column.index"
        />
      </template>
    </bk-table>
  </section>
</template>

<script>
  import { DATA_TABLE } from './options';
  export default {
    data() {
      return {
        tableData: [...DATA_TABLE],
        columns: [
          {
            label: '序号',
            type: 'index',
            index: 0,
          },
          {
            label: '名称/内网IP',
            field: 'ip',
            index: 2,
          },
          {
            label: '来源',
            field: 'source',
            index: 1,
          },
          {
            label: '创建时间',
            field: 'create_time',
            index: 3,
          },
        ],
      };
    },
  };
</script>
