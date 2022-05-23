<template>
  <div class="demo">
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      multiple
      show-select-all
    >
      <bk-option
        v-for="(item, index) in datasource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
    </bk-select>
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      filterable
      multiple
      show-select-all
      multiple-mode="tag"
    >
      <bk-option
        v-for="(item, index) in datasource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
    </bk-select>
  </div>
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
  ]);
  const selectedValue = ref([1, 3, 4, '']);
</script>
<style scoped>
.demo {
  display: flex;
}

.bk-select {
  width: 300px;
  margin-right: 20px;
}
</style>

