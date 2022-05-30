<template>
  <bk-select
    v-model="selectedValue"
    class="bk-select"
    filterable
    :scroll-loading="scrollLoading"
    @scroll-end="handleScrollEnd"
  >
    <bk-option
      v-for="(item, index) in datasource"
      :key="index"
      :value="item.value"
      :label="item.label"
      :disabled="item.disabled"
    />
  </bk-select>
</template>
<script setup>
  import { ref } from 'vue';
  const datasource = ref([
    {
      value: 'string',
      label: '爬山',
    },
    {
      value: false,
      label: '跑步',
    },
    {
      value: undefined,
      label: '未知',
    },
    {
      value: 1,
      label: '健身',
    },
    {
      value: null,
      label: '骑车',
    },
    {
      value: '',
      label: '跳舞',
    },
    {
      value: {},
      label: '睡觉',
      disabled: true,
    },
  ]);
  const selectedValue = ref(false);
  const scrollLoading = ref(false);
  const handleScrollEnd = () => {
    scrollLoading.value = true;
    setTimeout(() => {
      datasource.value.push({
        value: new Date().getTime(),
        label: `滚动加载${new Date().getTime()}`,
      });
      scrollLoading.value = false;
    }, 3000);
  };
</script>
<style scoped>
.bk-select {
  width: 300px;
}
</style>

