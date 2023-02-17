<template>
  <div class="row">
    <div class="cell">
      <span class="title">{{ t('默认排序') }}: sort scope = current</span>
      <bk-table
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        :empty-text="t('暂无数据')"
        @column-sort="handleSortBy"
      />
    </div>
    <div class="cell">
      <span class="title">sort scope = all</span>
      <bk-table
        :columns="columns1"
        :data="tableData"
        :pagination="pagination"
        @dblclick="handleDblClick"
      />
    </div>
  </div>
</template>

<script>
  import { defineComponent, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { DATA_COLUMNS, DATA_COLUMNS1 } from './options';

  export default defineComponent({
    components: {},
    setup() {
      const { t } = useI18n();

      const tableData = ref(new Array(Math.ceil(Math.random() * 9000) + 1000).fill('')
        .map((_, index) => ({
          ip: `${index}--192.168.0.x`,
          source: `${index}_QQ`,
          status: t('创建中'),
          create_time: `2018-05-25 15:02:24.${index}`,
        })));

      const pagination = reactive({
        count: tableData.value.length,
        limit: 10,
      });

      const handleSortBy = (arg) => {
        console.log('handleSortBy', arg);
      };

      const handleDblClick = (...args) => {
        console.log(args);
      };

      return {
        columns: [...DATA_COLUMNS],
        columns1: [...DATA_COLUMNS1],
        tableData,
        pagination,
        handleSortBy,
        handleDblClick,
        t,
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
