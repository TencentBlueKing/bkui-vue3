<template>
  <div>
    <bk-table
      :columns="columns"
      :data="tableData"
      :settings="settings"
      :max-height="maxHeight"
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
        tableData: DATA_FIX_TABLE,
        columns: [...DATA_FIX_COLUMNS],
        maxHeight: 300,
      };
    },
    mounted() {
      // setTimeout(() => {
      //   this.maxHeight = 300;
      //   console.log('table maxHeight', this.maxHeight);
      //   this.tableData.length = 0;
      //   this.tableData = [];
      //   this.tableData.push(...DATA_FIX_TABLE.slice(0, 100))
      // }, 3000)
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
