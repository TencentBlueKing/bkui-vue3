<template>
  <div style=" width: 100%;height: 300px;">
    <bk-table
      :columns="columns"
      :data="tableData"
      :empty-text="t('暂无数据')"
      @row-click="handleRowClick"
    />
    <span>on row click: {{ `index: ${ activeRowInfo.index }` }}</span>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { DATA_COLUMNS, DATA_TABLE } from './options';
  export default defineComponent({
    components: {},
    setup() {
      const { t } = useI18n();
      const handleRowClick = (e, row, index, rows, source) => {
        Object.assign(this.activeRowInfo, { e, row, index, rows, source });
        console.log('active row', this.activeRowInfo);
      };

      return {
        tableData: [...DATA_TABLE],
        columns: [...DATA_COLUMNS],
        activeRowInfo: {},
        handleRowClick,
        t,
      };
    },
  });
</script>
