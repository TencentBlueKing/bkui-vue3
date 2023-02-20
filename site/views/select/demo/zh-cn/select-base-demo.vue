<template>
  <bk-select
    v-model="selectedValue"
    class="bk-select"
    :placeholder="'请选择'"
    :search-placeholder="'请输入关键字'"
    :no-data-text="'无数据'"
    :no-match-text="'无匹配数据'"
    :loading-text="'加载中...'"
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
      <i class="bk-icon icon-plus-circle" />新增
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
          disabled: true,
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
