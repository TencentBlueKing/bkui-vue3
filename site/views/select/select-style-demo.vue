<template>
  <div class="style-demo">
    <!-- small -->
    <BkSelect
      v-model="selectedValue"
      class="bk-select"
      size="small"
    >
      <BkOption
        v-for="(item, index) in datasource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
    </BkSelect>
    <!-- default -->
    <BkSelect
      v-model="selectedValue"
      class="bk-select"
    >
      <BkOption
        v-for="(item, index) in datasource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
    </BkSelect>
    <!-- large -->
    <BkSelect
      v-model="selectedValue"
      class="bk-select"
      size="large"
    >
      <BkOption
        v-for="(item, index) in datasource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
    </BkSelect>
    <!-- small large -->
    <BkSelect
      v-model="selectedValue"
      class="bk-select"
      size="small"
      behavior="simplicity"
    >
      <BkOption
        v-for="(item, index) in datasource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
    </BkSelect>
    <!-- simplicity large -->
    <BkSelect
      v-model="selectedValue"
      class="bk-select"
      size="large"
      behavior="simplicity"
    >
      <BkOption
        v-for="(item, index) in datasource"
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
</script>
<style scoped>
.style-demo {
  display: flex;
}
.bk-select {
  width: 200px;
  margin-right:20px;
}
</style>

