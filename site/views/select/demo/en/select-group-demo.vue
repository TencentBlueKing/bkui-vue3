<template>
  <div class="demo">
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      multiple
      show-select-all
      filterable
      :placeholder="'Please select'"
      :search-placeholder="'Please enter keywords'"
      :no-data-text="'No data'"
      :no-match-text="'No matching data'"
      :loading-text="'Loading...'"
      :select-all-text="'All'"
    >
      <bk-option-group
        :label="'Group 1'"
        collapsible
      >
        <bk-option
          v-for="(item, index) in dataSource"
          :key="index"
          :value="item.value"
          :label="item.label"
        />
      </bk-option-group>
      <bk-option-group
        :label="'Group 2'"
        collapsible
      >
        <bk-option
          value="1001"
          :label="'Exercise - 1'"
        />
        <bk-option
          value="1002"
          :label="'Exercise - 2'"
        />
        <bk-option
          value="1003"
          :label="'Exercise - 3'"
        />
      </bk-option-group>
    </bk-select>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  import { BkOptionGroup } from '@bkui-vue/select';
  export default defineComponent({
    components: {
      BkOptionGroup,
    },
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
        BkOptionGroup,
        handleToggle,
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

