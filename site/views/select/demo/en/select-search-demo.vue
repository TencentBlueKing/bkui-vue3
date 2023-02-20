<template>
  <div class="demo">
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      multiple
      filterable
      :placeholder="'Please select'"
      :search-placeholder="'Please enter keywords'"
      :no-data-text="'No data'"
      :no-match-text="'No matching data'"
      :loading-text="'Loading...'"
      :select-all-text="'All'"
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
      :input-search="false"
      multiple
      filterable
      :placeholder="'Please select'"
      :search-placeholder="'Please enter keywords'"
      :no-data-text="'No data'"
      :no-match-text="'No matching data'"
      :loading-text="'Loading...'"
      :select-all-text="'All'"
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
      :input-search="false"
      multiple
      filterable
      multiple-mode="tag"
      :placeholder="'Please select'"
      :search-placeholder="'Please enter keywords'"
      :no-data-text="'No data'"
      :no-match-text="'No matching data'"
      :loading-text="'Loading...'"
      :select-all-text="'All'"
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
      multiple
      filterable
      multiple-mode="tag"
      :placeholder="'Please select'"
      :search-placeholder="'Please enter keywords'"
      :no-data-text="'No data'"
      :no-match-text="'No matching data'"
      :loading-text="'Loading...'"
      :select-all-text="'All'"
    >
      <bk-option
        v-for="(item, index) in dataSource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
    </bk-select>
    <bk-select
      class="bk-select"
      multiple
      filterable
      :remote-method="remoteMethod"
      :placeholder="'Please select'"
      :search-placeholder="'Please enter keywords'"
      :no-data-text="'No data'"
      :no-match-text="'No matching data'"
      :loading-text="'Loading...'"
      :select-all-text="'All'"
    >
      <bk-option
        v-for="(item) in list"
        :key="item.value"
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
      const selectedValue = ref('dancing');
      const list = ref([]);

      const remoteMethod = async value => new Promise((resolve) => {
        if (!value)  {
          list.value = [];
          resolve('ok');
        } else {
          setTimeout(() => {
            list.value = new Array(10).fill('')
              .map((_, i) => ({
                value: `${i}-${value}`,
                label: `label-${value}-${i}`,
              }));
            resolve('ok');
          }, 1000);
        };
      });

      return {
        dataSource,
        selectedValue,
        list,
        remoteMethod,
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

