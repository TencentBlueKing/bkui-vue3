<template>
  <bk-select
    v-model="selectedValue"
    class="bk-select"
    filterable
    multiple
    allow-create
    multiple-mode="tag"
    show-select-all
  >
    <bk-option
      v-for="(item, index) in dataSource"
      :key="index"
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
        },
      ]);
      const selectedValue = ref('running');

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

