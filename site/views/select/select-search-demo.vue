<template>
  <div class="demo">
    <BkSelect
      v-model="selectedValue"
      class="bk-select"
      multiple
      filterable
    >
      <BkOption
        v-for="(item, index) in datasource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
    </BkSelect>
    <BkSelect
      class="bk-select"
      multiple
      filterable
      :remote-method="remoteMethod"
    >
      <BkOption
        v-for="(item, index) in list"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
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
const list = ref([]);
const remoteMethod = async value => new Promise((resolve) => {
  setTimeout(() => {
    list.value = new Array(10).fill('')
      .map((_, i) => ({
        value: `${i}-${value}`,
        label: `label-${value}-${i}`,
      }));
    resolve('ok');
  }, 3000);
});
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

