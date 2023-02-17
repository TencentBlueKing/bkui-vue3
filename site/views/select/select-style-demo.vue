<template>
  <div class="style-demo">
    <!-- small -->
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      size="small"
      :placeholder="t('请选择')"
      :search-placeholder="t('请输入关键字')"
      :no-data-text="t('无数据')"
      :no-match-text="t('无匹配数据')"
      :loading-text="t('加载中...')"
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
      :placeholder="t('请选择')"
      :search-placeholder="t('请输入关键字')"
      :no-data-text="t('无数据')"
      :no-match-text="t('无匹配数据')"
      :loading-text="t('加载中...')"
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
      :placeholder="t('请选择')"
      :search-placeholder="t('请输入关键字')"
      :no-data-text="t('无数据')"
      :no-match-text="t('无匹配数据')"
      :loading-text="t('加载中...')"
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
      :placeholder="t('请选择')"
      :search-placeholder="t('请输入关键字')"
      :no-data-text="t('无数据')"
      :no-match-text="t('无匹配数据')"
      :loading-text="t('加载中...')"
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
      :placeholder="t('请选择')"
      :search-placeholder="t('请输入关键字')"
      :no-data-text="t('无数据')"
      :no-match-text="t('无匹配数据')"
      :loading-text="t('加载中...')"
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
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
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
          disabled: true,
        },
      ]);
      const selectedValue = ref('running');

      return {
        dataSource,
        selectedValue,
        t,
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

