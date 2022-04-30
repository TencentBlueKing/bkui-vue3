<template>
  <div class="demo">
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      multiple
      show-select-all
      filterable
    >
      <bk-option-group
        label="分组1"
        collapsible
      >
        <bk-option
          v-for="(item, index) in datasource"
          :key="index"
          :value="item.value"
          :label="item.label"
        />
      </bk-option-group>
      <bk-option-group
        label="分组2"
        collapsible
      >
        <bk-option
          value="1001"
          label="运动-1"
        />
        <bk-option
          value="1002"
          label="运动-2"
        />
        <bk-option
          value="1003"
          label="运动-3"
        />
      </bk-option-group>
    </bk-select>
  </div>
</template>
<script setup>
  import { ref } from 'vue';

  import { BkOptionGroup } from '@bkui-vue/select';

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
  margin-right: 20px;
}
</style>

