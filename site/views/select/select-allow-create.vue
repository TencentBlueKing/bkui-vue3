<template>
  <div style="display: flex;">
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
        v-for="(item, index) in datasource"
        :key="index"
        :value="item.value"
        :label="item.label"
        :disabled="item.disabled"
      />
    </bk-select>
    <bk-select
      class="bk-select"
      filterable
      allow-create
    >
      <bk-option
        v-for="(item, index) in datasource"
        :key="index"
        :value="item.value"
        :label="item.label"
        :disabled="item.disabled"
      />
    </bk-select>
  </div>
</template>
<script setup>
  import { ref } from 'vue';
  const datasource = ref([
    {
      value: 'climbing',
      label: '爬山',
    },
    {
      value: 'running',
      label: '跑步',
    },
    {
      value: 'unknow',
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
  const selectedValue = ref('running');
</script>
<style scoped>
.bk-select {
  width: 300px;
  margin-right: 10px;
}
</style>

