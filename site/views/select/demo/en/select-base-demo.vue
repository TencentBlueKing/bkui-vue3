<template>
  <bk-select
    v-model="selectedValue"
    class="bk-select"
    :placeholder="'Please select'"
    :search-placeholder="'Please enter keywords'"
    :no-data-text="'No data'"
    :no-match-text="'No matching data'"
    :loading-text="'Loading...'"
    filterable
    auto-focus
    @toggle="handleToggle"
  >
    <bk-option
      v-for="(item, index) in dataSource"
      :key="index"
      :value="item.value"
      :label="item.label"
      :disabled="item.disabled"
    />
    <template #extension>
      <i class="bk-icon icon-plus-circle" />Add
    </template>
  </bk-select>
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
        },
      ]);
      const selectedValue = ref('sleep');

      const handleToggle = (value) => {
        console.log(value);
      };

      return {
        dataSource,
        selectedValue,
        handleToggle,
      };
    },
  });
</script>
<style scoped>
.bk-select {
  width: 300px;
}
</style>
