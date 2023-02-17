<template>
  <bk-select
    v-model="selectedValue"
    class="bk-select"
    filterable
    :scroll-loading="scrollLoading"
    :placeholder="t('请选择')"
    :search-placeholder="t('请输入关键字')"
    :no-data-text="t('无数据')"
    :no-match-text="t('无匹配数据')"
    :loading-text="t('加载中...')"
    @scroll-end="handleScrollEnd"
  >
    <bk-option
      v-for="(item) in dataSource"
      :key="item.value"
      :value="item.value"
      :label="item.label"
      :disabled="item.disabled"
    />
  </bk-select>
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
      const selectedValue = ref('dancing');
      const scrollLoading = ref(false);
      const handleScrollEnd = () => {
        scrollLoading.value = true;
        setTimeout(() => {
          dataSource.value.push({
            value: new Date().getTime(),
            label: `滚动加载${new Date().getTime()}`,
          });
          scrollLoading.value = false;
        }, 3000);
      };

      return {
        dataSource,
        selectedValue,
        scrollLoading,
        handleScrollEnd,
        t,
      };
    },
  });
</script>
<style scoped>
.bk-select {
  width: 300px;
}
</style>

