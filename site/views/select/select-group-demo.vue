<template>
  <div class="demo">
    <bk-select
      class="bk-select"
      v-model="selectedValue"
      filterable
      multiple
      show-select-all
    >
      <bk-option-group
        label="分组1"
        collapsible
      >
        <bk-option
          v-for="(item, index) in datasource"
          :id="item.value"
          :key="index"
          :name="item.label"
        />
      </bk-option-group>
      <bk-option-group
        label="分组2"
        collapsible
      >
        <bk-option
          label="运动-1"
          value="1001"
        />
        <bk-option
          label="运动-2"
          value="1002"
        />
        <bk-option
          label="运动-3"
          value="1003"
        />
      </bk-option-group>
    </bk-select>
    <bk-select
      class="bk-select"
      v-model="selectedValue"
      filterable
      multiple
    >
      <bk-option-group
        label="分组1"
        group-style="divider"
      >
        <bk-option
          v-for="(item, index) in datasource"
          :id="item.value"
          :key="index"
          :name="item.label"
        />
      </bk-option-group>
      <bk-option-group
        label="分组2"
        group-style="divider"
      >
        <bk-option
          label="运动-1"
          value="1001"
        />
        <bk-option
          label="运动-2"
          value="1002"
        />
        <bk-option
          label="运动-3"
          value="1003"
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
  const selectedValue = ref('');
</script>
<style scoped>
  .demo {
    display: flex;
    gap: 10px;
  }

  .bk-select {
    width: 300px;
    margin-right: 20px;
  }
</style>
