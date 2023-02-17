<template>
  <div style="width: 100%; height: 300px">
    <bk-table
      :columns="columns"
      :data="remoteData"
      :pagination="pagination"
      :height="300"
      border="horizontal"
      remote-pagination
      @page-value-change="handlePageValueChange"
      @page-limit-change="handlePageLimitChange"
      @column-sort="handleColumnSort"
    />
  </div>
</template>

<script>
  import { computed, defineComponent, onMounted, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { DATA_COLUMNS } from './options';

  export default defineComponent({
    components: {},
    setup() {
      const { t } = useI18n();

      const tableData = new Array(Math.ceil(Math.random() * 9000) + 1000)
        .fill('')
        .map((_, index) => ({
          ip: `${index}--192.168.0.x`,
          source: `${index}_QQ`,
          status: t('创建中'),
          create_time: `2018-05-25 15:02:24.${index}`,
        }));
      let pagination = reactive({ count: 0, limit: 20, current: 1 });

      const remoteData = computed(() => {
        const { limit, current } = pagination;
        const startIndex = (current - 1) * limit;
        const endIndex = current * limit;
        return tableData.slice(startIndex, endIndex);
      });

      const handlePageValueChange = (value) => {
        pagination = Object.assign(pagination, { current: value });
      };

      const handlePageLimitChange = (limit) => {
        pagination = Object.assign(pagination, { limit });
      };

      const handleColumnSort = (...args) => {
        console.log('sort', args);
      };

      onMounted(() => {
        setTimeout(() => {
          pagination.count = 100;
        }, 300);
      });

      return {
        tableData,
        columns: [...DATA_COLUMNS],
        pagination,
        remoteData,
        handlePageValueChange,
        handlePageLimitChange,
        handleColumnSort,
      };
    },
  });
</script>
