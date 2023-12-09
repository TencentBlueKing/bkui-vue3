<template>
  <div class="demo">
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      multiple
      show-select-all
      @select="handleSelect"
      @deselect="handleDeselect"
    >
      <bk-option
        v-for="(item, index) in datasource"
        :id="item.value"
        :key="index"
        :name="item.label"
      />
    </bk-select>
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      multiple
      selected-style="checkbox"
      show-all
      allOptionId="all"
    >
      <bk-option
        v-for="(item, index) in datasource"
        :id="item.value"
        :key="index"
        :name="item.label"
        :disabled="item.disabled"
      />
    </bk-select>
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      filterable
      multiple
      show-select-all
      multiple-mode="tag"
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
      v-model="listValue"
      class="bk-select"
      filterable
      multiple
      show-select-all
      multiple-mode="tag"
      collapse-tags
      :list="datasourceList"
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

  const tagRemove = (val) => {
    console.log(val);
  };

  const handleSelect = (v) => {
    console.log('select', v);
  };

  const handleDeselect = (v) => {
    console.log('deselect', v);
  };

  onBeforeMount(() => {
    new Array(100).fill(0)
      .forEach((item, index) => {
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
