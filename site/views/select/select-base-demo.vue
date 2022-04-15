<template>
  <BkSelect
    v-model="selectedValue"
    class="bk-select"
    filterable
  >
    <BkOption
      v-for="(item, index) in datasource"
      :key="index"
      :value="item.value"
      :label="item.label"
      :disabled="item.disabled"
    />
  </BkSelect>
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
</script>
<style scoped>
.bk-select {
  width: 300px;
}
</style>

