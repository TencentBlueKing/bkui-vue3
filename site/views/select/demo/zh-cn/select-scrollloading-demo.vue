<template>
  <bk-select
    v-model="selectedValue"
    class="bk-select"
    filterable
    :scroll-loading="scrollLoading"
    :placeholder="'请选择'"
    :search-placeholder="'请输入关键字'"
    :no-data-text="'无数据'"
    :no-match-text="'无匹配数据'"
    :loading-text="'加载中...'"
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
      const selectedValue = ref('dancing');
      const scrollLoading = ref(false);

      const handleScrollEnd = () => {
        scrollLoading.value = true;
        setTimeout(() => {
          dataSource.value.push({
            value: new Date().getTime(),
            label: `滚动加载${new Date().getTime()}`,
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

