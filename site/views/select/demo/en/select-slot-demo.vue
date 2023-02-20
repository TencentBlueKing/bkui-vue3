<template>
  <div class="demo">
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      filterable
      multiple
      show-select-all
      multiple-mode="tag"
      collapse-tags
      :placeholder="'Please select'"
      :search-placeholder="'Please enter keywords'"
      :no-data-text="'No data'"
      :no-match-text="'No matching data'"
      :loading-text="'Loading...'"
    >
      <bk-option
        v-for="(item, index) in dataSource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
      <template #tag="{selected}">
        {{ selected.map(item => `${item.label}( ${item.value} )`).join('；') }}
      </template>
    </bk-select>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const dataSource = ref([
        {
          value: 1,
          label: 'climbing',
        },
        {
          value: 2,
          label: 'running',
        },
        {
          value: 3,
          label: 'unknown',
        },
        {
          value: 4,
          label: 'fitness',
        },
        {
          value: 5,
          label: 'bike',
        },
        {
          value: 6,
          label: 'dancing',
        },
      ]);
      const selectedValue = ref([1, 2, 3, 4]);

      return {
        dataSource,
        selectedValue,
      };
    },
  });
</script>

<style scoped>
.demo {
  display: flex;
}

.bk-select {
  width: 300px;
  margin-right: 20px;
}
</style>

