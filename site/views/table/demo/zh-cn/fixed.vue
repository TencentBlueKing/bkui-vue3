<template>
  <div style="width: 100%; height: 300px">
    <bk-table
      :columns="columns"
      :data="tableData"
      height="100%"
      :settings="settings"
      :empty-text="'暂无数据'"
      @scroll-bottom="handleScrollBottom"
    />
  </div>
</template>

<script>
  import { defineComponent, reactive } from 'vue';

  import { DATA_FIX_COLUMNS, DATA_FIX_TABLE } from '../../options';
  export default defineComponent({
    components: {},
    setup() {
      const settings = reactive({
        checked: ['index'],
        fields: [
          {
            label: '序号',
            field: 'index',
            disabled: true,
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
      });

      const handleDblClick  = (...args) => {
        console.log(args);
      };

      const handleScrollBottom = (args) => {
        console.log('handleScrollBottom', args);
      };

      return {
        tableData: [...DATA_FIX_TABLE],
        columns: [...DATA_FIX_COLUMNS],
        settings,
        handleDblClick,
        handleScrollBottom,
      };
    },
  });
</script>
