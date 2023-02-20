<template>
  <div class="demo">
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      multiple
      show-select-all
      filterable
      :placeholder="'请选择'"
      :search-placeholder="'请输入关键字'"
      :no-data-text="'无数据'"
      :no-match-text="'无匹配数据'"
      :loading-text="'加载中...'"
      :select-all-text="'全部'"
    >
      <bk-option-group
        :label="'分组1'"
        collapsible
      >
        <bk-option
          v-for="(item, index) in dataSource"
          :key="index"
          :value="item.value"
          :label="item.label"
        />
      </bk-option-group>
      <bk-option-group
        :label="'分组2'"
        collapsible
      >
        <bk-option
          value="1001"
          :label="'运动-1'"
        />
        <bk-option
          value="1002"
          :label="'运动-2'"
        />
        <bk-option
          value="1003"
          :label="'运动-3'"
        />
      </bk-option-group>
    </bk-select>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  import { BkOptionGroup } from '@bkui-vue/select';
  export default defineComponent({
    components: {
      BkOptionGroup,
    },
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
        },
      ]);
      const selectedValue = ref('running');

      const handleToggle = (value) => {
        console.log(value);
      };

      return {
        dataSource,
        selectedValue,
        BkOptionGroup,
        handleToggle,
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

