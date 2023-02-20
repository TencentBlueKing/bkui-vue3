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
    :placeholder="'请选择'"
    :search-placeholder="'请输入关键字'"
    :no-data-text="'无数据'"
    :no-match-text="'无匹配数据'"
    :loading-text="'加载中...'"
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
          .map((_, index) => ({ value: index, label: `测试数据${index}` }));
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
