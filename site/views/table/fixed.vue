<template>
  <div style=" width: 100%;height: 300px">
    <bk-table
      :columns="columns"
      :data="tableData"
      height="100%"
      :settings="settings"
      @scroll-bottom="handleScrollBottom"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import { DATA_FIX_COLUMNS, DATA_FIX_TABLE } from './options';
  export default defineComponent({
    components: {},
    data() {
      return {
        tableData: [...DATA_FIX_TABLE],
        columns: [...DATA_FIX_COLUMNS],
        settings: {
          fields: [{
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
                   }],
          checked: ['ip', 'index'],
        },
      };
    },
    methods: {
      handleDblClick(...args) {
        console.log(args);
      },
      handleScrollBottom(args) {
        console.log('handleScrollBottom', args);
      },
    },
  });
</script>
