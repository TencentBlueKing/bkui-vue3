<template>
  <div class="demo">
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      filterable
      multiple
      show-select-all
      multiple-mode="tag"
      collapse-tags
      :placeholder="'请选择'"
      :search-placeholder="'请输入关键字'"
      :no-data-text="'无数据'"
      :no-match-text="'无匹配数据'"
      :loading-text="'加载中...'"
      :select-all-text="'全部'"
    >
      <bk-option
        v-for="(item, index) in dataSource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
      <template #tag="{selected}">
        {{ selected.map(item => `${item.label}( ${item.value} )`).join('；') }}
      </template>
    </bk-select>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const dataSource = ref([
        {
          value: 1,
          label: '爬山',
        },
        {
          value: 2,
          label: '跑步',
        },
        {
          value: 3,
          label: '未知',
        },
        {
          value: 4,
          label: '健身',
        },
        {
          value: 5,
          label: '骑车',
        },
        {
          value: 6,
          label: '跳舞',
        },
      ]);
      const selectedValue = ref([1, 2, 3, 4]);

      return {
        dataSource,
        selectedValue,
      };
    },
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

