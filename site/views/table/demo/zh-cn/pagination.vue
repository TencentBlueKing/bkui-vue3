<template>
  <div style="width: 100%; height: 300px;">
    <bk-table
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      height="100%"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { DATA_COLUMNS } from '../../options';;

  export default defineComponent({
    components: {},
    setup() {
      const { t } = useI18n();
      const DATA_ROWS = new Array(Math.ceil(Math.random() * 9000) + 1000).fill('')
        .map((_, index) => ({
          ip: `${index}--192.168.0.x`,
          source: `${index}_QQ`,
          status: t('创建中'),
          create_time: `2018-05-25 15:02:24.${index}`,
        }));
      return {
        tableData: DATA_ROWS,
        columns: DATA_COLUMNS.map(item => ({ ...item })),
        pagination: { count: DATA_ROWS.length, limit: 10 },
      };
    },
  });
</script>
