<template>
  <bk-transfer
    v-model:targetList="targetList"
    :source-list="list"
    :display-key="'service_name'"
    sort-key="service_name"
    :setting-key="'service_code'"
    show-overflow-tips
    searchable
    sortable
    @change="change"
  />
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import BkTransfer from '@bkui-vue/transfer';

  export default defineComponent({
    components: {
      BkTransfer,
    },
    setup() {
      const { t } = useI18n();
      const targetList = ref(['code']);
      const list = ref([
        { service_code: 'pipeline', service_name: t('流水线'), disabled: true },
        { service_code: 'codecc', service_name: t('代码检查') },
        { service_code: 'bcs', service_name: t('容器服务') },
        { service_code: 'artifactory', service_name: t('版本仓库') },
        { service_code: 'ticket', service_name: t('凭证管理') },
        { service_code: 'code', service_name: t('代码库'), disabled: true },
        { service_code: 'experience', service_name: t('版本体验') },
        { service_code: 'environment', service_name: t('环境管理') },
        { service_code: 'quality', service_name: t('质量红线') },
        { service_code: 'turbo', service_name: t('编译加速') },
      ]);

      const change = (sourceList, targetList, targetValueList) => {
        console.log(sourceList);
        console.log(targetList);
        console.log(targetValueList);
      };

      return {
        targetList,
        list,
        change,
      };
    },
  });
</script>
