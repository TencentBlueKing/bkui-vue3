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
          label: '爬山',
        },
        {
          value: 'running',
          label: '跑步',
        },
        {
          value: 'unknown',
          label: '未知',
        },
        {
          value: 'fitness',
          label: '健身',
        },
        {
          value: 'bike',
          label: '骑车',
        },
        {
          value: 'dancing',
          label: '跳舞',
        },
        {
          value: 'sleep',
          label: '睡觉',
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

