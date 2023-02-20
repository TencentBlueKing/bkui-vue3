<template>
  <bk-select
    v-model="selectedValue"
    class="bk-select"
    filterable
    :scroll-loading="scrollLoading"
    :placeholder="'Please select'"
    :search-placeholder="'Please enter keywords'"
    :no-data-text="'No data'"
    :no-match-text="'No matching data'"
    :loading-text="'Loading...'"
    @scroll-end="handleScrollEnd"
  >
    <bk-option
      v-for="(item) in dataSource"
      :key="item.value"
      :value="item.value"
      :label="item.label"
      :disabled="item.disabled"
    />
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
          disabled: true,
        },
      ]);
      const selectedValue = ref('dancing');
      const scrollLoading = ref(false);

      const handleScrollEnd = () => {
        scrollLoading.value = true;
        setTimeout(() => {
          dataSource.value.push({
            value: new Date().getTime(),
            label: `Rolling load ${new Date().getTime()}`,
          });
          scrollLoading.value = false;
        }, 3000);
      };

      return {
        dataSource,
        selectedValue,
        scrollLoading,
        handleScrollEnd,
      };
    },
  });
</script>
<style scoped>
.bk-select {
  width: 300px;
}
</style>

