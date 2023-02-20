<template>
  <div class="demo">
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      multiple
      show-select-all
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
    </bk-select>
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      filterable
      multiple
      show-select-all
      multiple-mode="tag"
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
    </bk-select>
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
    </bk-select>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const dataSource = ref([
        {
          value: 'climbing',
          label: 'climbing',
        },
        {
          value: 'running',
          label: 'running',
        },
        {
          value: 'unknown',
          label: 'unknown',
        },
        {
          value: 'fitness',
          label: 'fitness',
        },
        {
          value: 'bike',
          label: 'bike',
        },
        {
          value: 'dancing',
          label: 'dancing',
        },
        {
          value: 'sleep',
          label: 'sleep',
          disabled: true,
        },
      ]);
      const selectedValue = ref(['dancing', 'bike']);

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

