<template>
  <div style="height: 300px; width: 100%">
    <bk-table
      :columns="columns"
      :data="tableData"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { DATA_TABLE, DATA_COLUMNS } from './options';
export default defineComponent({
  components: {},
  data() {
    return {
      tableData: [...DATA_TABLE],
      columns: [...DATA_COLUMNS],
    };
  },
});
</script>
