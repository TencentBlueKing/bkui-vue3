<template>
  <bk-select
    v-model="selectedValue"
    class="bk-select"
    filterable
    auto-focus
    no-data-text="sdsd"
    no-match-text="kkk"
    @toggle="handleToggle"
  >
    <bk-option
      v-for="(item, index) in datasource"
      :key="index"
      :value="item.value"
      :label="item.label"
      :disabled="item.disabled"
    />
    <template #extension>
      <bk-input
        v-if="showEdit"
        @enter="handleEnter"
      />
      <span
        v-else
        @click="showEdit = true"
      ><i class="bk-icon icon-plus-circle" />新增</span>
    </template>
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
  const showEdit = ref(false);
  const selectedValue = ref('sleep');
  const handleToggle = (value) => {
    console.log(value);
  };
  const handleEnter = (v, e) => {
    e.stopPropagation();
    showEdit.value = false;
  };
</script>
<style scoped>
.bk-select {
  width: 300px;
}
</style>
