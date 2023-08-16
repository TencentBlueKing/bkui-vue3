<template>
  <section>
    <bk-table
      stripe
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
        ],
      };
    },
  };
</script>
