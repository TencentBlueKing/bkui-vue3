<template>
  <div class="style-demo">
    <!-- small -->
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      size="small"
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
    <!-- default -->
    <bk-select
      v-model="selectedValue"
      class="bk-select"
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
    <!-- large -->
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      size="large"
      multiple
      filterable
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
    <!-- simplicity small -->
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      size="small"
      behavior="simplicity"
      multiple
      filterable
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
    <!-- simplicity large -->
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      size="large"
      behavior="simplicity"
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
        },
      ]);
      const selectedValue = ref('running');

      return {
        dataSource,
        selectedValue,
      };
    },
  });
</script>

<style scoped>
.style-demo {
  display: flex;
}

.bk-select {
  width: 200px;
  margin-right: 20px;
}
</style>

