<template>
  <div class="demo">
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      multiple
      show-select-all
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
    </bk-select>
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      filterable
      multiple
      show-select-all
      multiple-mode="tag"
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
    </bk-select>
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
    >
      <bk-option
        v-for="(item, index) in dataSource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
    </bk-select>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const dataSource = ref([
        {
          value: 'climbing',
          label: '爬山',
        },
        {
          value: 'running',
          label: '跑步',
        },
        {
          value: 'unknown',
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

