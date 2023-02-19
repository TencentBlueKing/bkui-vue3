<template>
  <div style="height: 300px">
    <bk-table
      height="100%"
      :columns="columns"
      :data="tableData"
      :scroll-loading="isScrollLoading"
      @scroll-bottom="handleScrollBottom"
    />
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  import { DATA_FIX_COLUMNS, DATA_FIX_TABLE } from './options';
  export default defineComponent({
    components: {},
    setup() {
      const tableData = ref([...DATA_FIX_TABLE]);
      const  columns = ref([...DATA_FIX_COLUMNS]);
      const isScrollLoading = ref(false);

      const handleScrollBottom = (arg) => {
        console.log('handleScrollBottom', arg);
        isScrollLoading.value = true;
        setTimeout(() => {
          isScrollLoading.value = false;
        }, 1500);
      };

      return {
        isScrollLoading,
        tableData,
        columns,
        handleScrollBottom,
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
