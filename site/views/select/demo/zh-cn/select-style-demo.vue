<template>
  <div class="style-demo">
    <!-- small -->
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      size="small"
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
    <!-- default -->
    <bk-select
      v-model="selectedValue"
      class="bk-select"
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
    <!-- large -->
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      size="large"
      multiple
      filterable
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
    <!-- simplicity small -->
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      size="small"
      behavior="simplicity"
      multiple
      filterable
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
    <!-- simplicity large -->
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      size="large"
      behavior="simplicity"
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
      const selectedValue = ref('running');

      return {
        dataSource,
        selectedValue,
      };
    },
  });
</script>

<style scoped>
.style-demo {
  display: flex;
}

.bk-select {
  width: 200px;
  margin-right: 20px;
}
</style>

