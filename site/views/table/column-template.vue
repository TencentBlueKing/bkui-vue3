<template>
  <section>
    <bk-table
      :data="tableData"
      :settings="settings"
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
        settings: {
          trigger: 'click',
          fields: [
            {
              name: '序号',
              id: 'index',
            },
            {
              name: '名称/内网IP',
              id: 'ip',
            },
            {
              name: '来源',
              id: 'source',
            },
            {
              name: '创建时间',
              id: 'create_time',
            },
          ],
          checked: ['ip', 'index'],
        },
      };
    },
  };
</script>
