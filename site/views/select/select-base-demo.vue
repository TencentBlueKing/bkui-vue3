<template>
  <bk-select
    v-model="selectedValue"
    class="bk-select"
    filterable
  >
    <bk-option
      v-for="(item, index) in datasource"
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
      value: 'dancing',
      label: '跳舞',
    },
    {
      value: {},
      label: '睡觉',
      disabled: true,
    },
  ]);
  const selectedValue = ref(false);
</script>
<style scoped>
.bk-select {
  width: 300px;
}
</style>
