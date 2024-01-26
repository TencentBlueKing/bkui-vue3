<template>
  <div style="height: 300px">
    <bk-table
      height="100%"
      :columns="columns"
      :data="tableData"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: {},
    data() {
      return {
        tableData: new Array(10).fill('')
          .map((_r, rIndex) => (new Array(20).fill('')
            .reduce((output, _cr, cIndex) => Object.assign(output, {
              [`col_${cIndex + 1}`]: `row_${rIndex + 1}_col_${cIndex + 1}`,
            }), {}))),
        columns: new Array(20).fill('')
          .map((_c, index) => ({
            label: `Column${index + 1}`,
            field: `col_${index + 1}`,
            minWidth: 200,
          })),
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
