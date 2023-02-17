<template>
  <div class="row">
    <bk-table
      :columns="columns"
      :data="tableData"
      row-hover="ato"
      settings
      show-overflow-tooltip
      :empty-text="emptyText"
      @dblclick="handleDblClick"
      @column-sort="handleSortBy"
    />
  </div>
</template>

<script>
  import { defineComponent, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { DATA_TABLE, DATE_COL_SPAN } from './options';
  export default defineComponent({
    components: {},
    setup() {
      const { t } = useI18n();

      const emptyText = ref(t('暂无数据'));

      const settings = reactive({
        fields: [
          {
            label: t('序号'),
            field: 'index',
            disabled: true,
          },
          {
            label: t('名称/内网IP'),
            field: 'ip',
          },
          {
            label: t('来源'),
            field: 'source',
          },
          {
            label: t('创建时间'),
            field: 'create_time',
          },
        ],
        checked: ['ip', 'index'],
      });

      const handleSortBy = (arg) => {
        console.log('handleSortBy', arg);
      };

      const handleDblClick = (...args) => {
        console.log(args);
      };

      return {
        isLoading: false,
        emptyText,
        settings,
        tableData: [...DATA_TABLE],
        columns: [...DATE_COL_SPAN],
        handleSortBy,
        handleDblClick,
      };
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
