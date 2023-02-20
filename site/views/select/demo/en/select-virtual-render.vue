<template>
  <bk-select
    v-model="selectedValue"
    class="bk-select"
    :list="dataSource"
    enable-virtual-render
    filterable
    multiple
    :input-search="false"
    multiple-mode="tag"
    :placeholder="'Please select'"
    :search-placeholder="'Please enter keywords'"
    :no-data-text="'No data'"
    :no-match-text="'No matching data'"
    :loading-text="'Loading...'"
  />
</template>

<script>
  import { defineComponent, onMounted, ref } from 'vue';

  export default defineComponent({
    setup() {
      const dataSource = ref([]);
      const selectedValue = ref();

      onMounted(() => {
        console.time();
        dataSource.value = new Array(6000).fill('')
          .map((_, index) => ({ value: index, label: `test data${index}` }));
        console.timeEnd();
      });

      return {
        dataSource,
        selectedValue,
      };
    },
  });
</script>

<style scoped>
.bk-select {
  width: 300px;
}
</style>
