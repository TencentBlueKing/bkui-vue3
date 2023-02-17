<template>
  <div class="demo">
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      multiple
      show-select-all
      filterable
      :placeholder="t('请选择')"
      :search-placeholder="t('请输入关键字')"
      :no-data-text="t('无数据')"
      :no-match-text="t('无匹配数据')"
      :loading-text="t('加载中...')"
      :select-all-text="t('全部')"
    >
      <bk-option-group
        :label="t('分组1')"
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
        :label="t('分组2')"
        collapsible
      >
        <bk-option
          value="1001"
          :label="t('运动-1')"
        />
        <bk-option
          value="1002"
          :label="t('运动-2')"
        />
        <bk-option
          value="1003"
          :label="t('运动-3')"
        />
      </bk-option-group>
    </bk-select>
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { BkOptionGroup } from '@bkui-vue/select';
  export default defineComponent({
    components: {
      BkOptionGroup,
    },
    setup() {
      const { t } = useI18n();
      const dataSource = ref([
        {
          value: 'climbing',
          label: t('爬山'),
        },
        {
          value: 'running',
          label: t('跑步'),
        },
        {
          value: 'unknow',
          label: t('未知'),
        },
        {
          value: 'fitness',
          label: t('健身'),
        },
        {
          value: 'bike',
          label: t('骑车'),
        },
        {
          value: 'dancing',
          label: t('跳舞'),
        },
        {
          value: 'sleep',
          label: t('睡觉'),
        },
      ]);
      const selectedValue = ref('running');
      const handleToggle = (value) => {
        console.log(value);
      };
      return {
        dataSource,
        selectedValue,
        handleToggle,
        BkOptionGroup,
        t,
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

