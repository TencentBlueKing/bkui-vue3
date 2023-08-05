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
          :id="item.value"
          :name="item.label"
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
}

.bk-select {
  width: 300px;
  margin-right: 20px;
}
</style>

