<template>
  <div>
    <h3>Empty data</h3>
    <div style="width: 100%; height: 300px">
      <bk-table
        :empty-text="'No data'"
        :columns="columns"
        :data="[]"
      />
    </div>
    <h3>Filter is empty - try filtering from Email</h3>
    <div style="width: 100%; height: 300px">
      <bk-table
        :empty-text="'No data'"
        :border="['outer']"
        :columns="columns"
        :data="tableData"
      />
    </div>
    <h3>Custom empty data-empty slot</h3>
    <div style="width: 100%; height: 300px">
      <bk-table
        :columns="columns"
        :data="[]"
      >
        <template #empty>
          <div :style="emptyTextStyle">
            EMPTY
          </div>
        </template>
      </bk-table>
    </div>
  </div>
</template>

<script>
  import { computed, defineComponent } from 'vue';

  import { DATA_COLUMNS, DATA_TABLE } from '../../options';
  export default defineComponent({
    components: {},
    setup() {
      const emptyTextStyle = computed(() => 'width: 100%; height: 100px; display: flex; justify-content: center; align-items: center; font-size: 30px;');

      return {
        emptyTextStyle,
        activeRowInfo: {},
        columns: [...DATA_COLUMNS],
        tableData: [...DATA_TABLE],

      };
    },
  });
</script>
