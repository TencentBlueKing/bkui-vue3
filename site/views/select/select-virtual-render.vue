<template>
  <bk-select
    v-model="selectedValue"
    class="bk-select"
    :list="dataSource"
    enable-virtual-render
    filterable
    multiple
    :input-search="false"
    multiple-mode="tag"
    :placeholder="t('请选择')"
    :search-placeholder="t('请输入关键字')"
    :no-data-text="t('无数据')"
    :no-match-text="t('无匹配数据')"
    :loading-text="t('加载中...')"
  />
</template>
<script>
  import { defineComponent, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const dataSource = ref([]);
      const selectedValue = ref();

      onMounted(() => {
        console.time();
        dataSource.value = new Array(6000).fill('')
          .map((_, index) => ({ value: index, label: `${t('测试数据')}${index}` }));
        console.timeEnd();
      });

      return {
        dataSource,
        selectedValue,
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
