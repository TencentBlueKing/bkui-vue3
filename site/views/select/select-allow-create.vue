<template>
  <div style="display: flex">
    <bk-select
      class="bk-select"
      v-model="selectedValueMultiple"
      multiple-mode="tag"
      allow-create
      filterable
      multiple
      show-select-all
    >
      <bk-option
        v-for="(item, index) in datasource"
        :disabled="item.disabled"
        :id="item.value"
        :key="index"
        :name="item.label"
      />
    </bk-select>
    <bk-select
      class="bk-select"
      v-model="selectedValueSingle"
      allow-create
      filterable
    >
      <bk-option
        v-for="(item, index) in datasource"
        :disabled="item.disabled"
        :id="item.value"
        :key="index"
        :name="item.label"
      />
    </bk-select>
  </div>
</template>
<script setup>
  import { ref } from 'vue';

  const selectedValueMultiple = ref('running');
  const selectedValueSingle = ref('');

  const datasource = [
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
  ];
</script>
<style scoped>
  .bk-select {
    width: 300px;
    margin-right: 10px;
  }
</style>
