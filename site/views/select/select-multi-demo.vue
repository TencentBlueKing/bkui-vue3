<template>
  <div class="demo">
    <bk-select
      class="bk-select"
      v-model="selectedValue"
      multiple
      show-select-all
      @deselect="handleDeselect"
      @select="handleSelect"
    >
      <bk-option
        v-for="(item, index) in datasource"
        :id="item.value"
        :key="index"
        :name="item.label"
      />
    </bk-select>
    <bk-select
      selected-style="checkbox"
      class="bk-select"
      v-model="selectedValue"
      all-option-id="all"
      filterable
      multiple
      show-all
      show-select-all
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
      class="bk-select"
      v-model="selectedValue"
      multiple-mode="tag"
      filterable
      multiple
      show-all
      show-select-all
      @tag-remove="tagRemove"
    >
      <bk-option
        v-for="(item, index) in datasource"
        :id="item.value"
        :key="index"
        :name="item.label"
      />
    </bk-select>
    <bk-select
      class="bk-select"
      v-model="listValue"
      :list="datasourceList"
      multiple-mode="tag"
      collapse-tags
      filterable
      multiple
      show-select-all
      @change="handleSelectChange"
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
  const selectedValue = ref(['dancing', 'bike']);

  const listValue = ref([1, 2, 3, 4, 5, 6, 7, 8]);
  const datasourceList = ref([]);

  const tagRemove = val => {
    console.log(val);
  };

  const handleSelect = v => {
    console.log('select', v);
  };

  const handleDeselect = v => {
    console.log('deselect', v);
  };

  const handleSelectChange = (v) => {
    console.log(v);
  };

  onBeforeMount(() => {
    new Array(10).fill(0).forEach((item, index) => {
      datasourceList.value.push({
        value: index,
        label: `list-${index}`,
      });
    });
  });
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
