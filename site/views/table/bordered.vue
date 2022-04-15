<template>
  <div style="height: 300px; width: 100%">
    <div style="padding: 15px 0">
      <bk-checkbox-group v-model="border">
        <bk-checkbox label="none" />
        <bk-checkbox
          label="row"
          disabled
        />
        <bk-checkbox label="col" />
        <bk-checkbox label="outer" />
      </bk-checkbox-group>
    </div>
    <bk-table
      :columns="columns"
      :data="tableData"
      :border="border"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import { DATA_COLUMNS, DATA_TABLE } from './options';
  export default defineComponent({
    components: {},
    data() {
      return {
        tableData: [...DATA_TABLE],
        columns: [...DATA_COLUMNS],
        border: ['row'],
      };
    },
  });
</script>
