<template>
  <div class="demo">
    <BkSelect
      v-model="selectedValue"
      class="bk-select"
      multiple
      show-select-all
      filterable
    >
      <BkOptionGroup collapsible>
        <BkOption
          v-for="(item, index) in datasource"
          :key="index"
          :value="item.value"
          :label="item.label"
        />
      </BkOptionGroup>
      <BkOptionGroup
        label="分组2"
        collapsible
      >
        <BkOption
          value="1001"
          label="运动-1"
        />
        <BkOption
          value="1002"
          label="运动-2"
        />
        <BkOption
          value="1003"
          label="运动-3"
        />
      </BkOptionGroup>
    </BkSelect>
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
const selectedValue = ref(false);
</script>
<style scoped>
.demo {
  display: flex;
}
.bk-select {
  width: 300px;
  margin-right:20px;
}
</style>

