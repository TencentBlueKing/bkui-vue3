<template>
  <div class="style-demo">
    <!-- small -->
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      size="small"
    >
      <bk-option
        v-for="(item, index) in datasource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
    </bk-select>
    <!-- default -->
    <bk-select
      v-model="selectedValue"
      class="bk-select"
    >
      <bk-option
        v-for="(item, index) in datasource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
    </bk-select>
    <!-- large -->
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      size="large"
    >
      <bk-option
        v-for="(item, index) in datasource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
    </bk-select>
    <!-- small large -->
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      size="small"
      behavior="simplicity"
    >
      <bk-option
        v-for="(item, index) in datasource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
    </bk-select>
    <!-- simplicity large -->
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      size="large"
      behavior="simplicity"
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

