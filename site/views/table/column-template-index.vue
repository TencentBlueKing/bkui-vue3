<template>
  <section>
    <bk-table :data="tableData">
      <bk-table-column
        :filter="{ list: statusFilters }"
        :label="'数量'"
        :sort="sort"
        field="count"
      />
      <template
        v-for="column in columns"
        :key="column.label"
      >
        <bk-table-column
          :field="column.field"
          :index="column.index"
          :label="column.label"
          :type="column.type"
        />
      </template>
      <template v-if="showOptionColumn">
        <bk-table-column label="操作">
          <template #default="{}">
            <bk-button theme="primary">Option</bk-button>
          </template>
        </bk-table-column>
      </template>
    </bk-table>
  </section>
</template>

<script setup>
  import { reactive, ref } from 'vue';

  import { DATA_TABLE } from './options';
  const sort = reactive({ sortScope: 'all' });
  const tableData = reactive(DATA_TABLE.map((d, index) => ({ ...d, count: index })));
  const showOptionColumn = ref(true);
  const t = str => str;
  const statusFilters = reactive([
    { text: t('已启用'), value: 'enabled' },
    { text: t('未启用'), value: 'disabled' },
  ]);
  const columns = reactive([
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
  ]);
</script>
