<template>
  <bk-select
    v-model="selectedValue"
    class="bk-select"
    filterable
    auto-focus
    @toggle="handleToggle"
  >
    <bk-option
      v-for="(item, index) in datasource"
      :key="index"
      :id="item.value"
      :name="item.label"
      :disabled="item.disabled"
    />
  </bk-select>
</template>
<script setup>
  import { ref } from 'vue';
  const datasource = ref([
    {
      value: 'climbing',
      label: '爬山',
    },
    {
      value: {a: 123 },
      label: '跑步',
    },
    {
      value: { b: 456 },
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

  const selectedValue = ref({b: 456});


</script>
<style scoped>
.bk-select {
  width: 300px;
}
</style>
