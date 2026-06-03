<template>
  <div style="display: flex">
    <bk-select
      class="bk-select"
      v-model="selectedValue"
      auto-focus
      filterable
      @select="handleSelect"
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
      style="margin-left: 10px"
      class="bk-select"
      v-model="listValue"
      :list="datasourceList"
      disable-focus-behavior
      filterable
      multiple
    />
  </div>
</template>
<script setup>
  import { onBeforeMount, ref } from 'vue';
  const datasource = ref([
    {
      value: 'climbing',
      label: '爬山',
    },
    {
      value: { a: 123 },
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
      disabled: {
        disabled: true,
        tips: '禁用提示',
      },
    },
  ]);

  const selectedValue = ref({ b: 456 });

  const listValue = ref(1);
  const datasourceList = ref([
    {
      value: 'climbing',
      label: '爬山',
    },
    {
      value: { a: 123 },
      label: '跑步',
    },
    {
      value: { b: 456 },
      label: '未知',
      disabled: true
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

  const handleSelect = v => {
    console.log(v);
  };

  onBeforeMount(() => {
    new Array(100).fill(0).forEach((item, index) => {
      datasourceList.value.push({
        value: index,
        label: `list-${index}`,
      });
    });
  });
</script>
<style scoped>
  .bk-select {
    width: 300px;
  }
</style>
