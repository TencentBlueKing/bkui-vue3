<template>
  <bk-transfer
    :target-list="value"
    :source-list="list"
    :title="title"
    :empty-content="emptyContent"
    :display-key="'service_name'"
    :sort-key="'service_code'"
    :setting-key="'service_code'"
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

      const title = ref([t('服务列表'), t('已选服务')]);
      const emptyContent = ref([t('暂无数据'), t('未选择任何服务')]);
      const value = ref(['artifactory', 'ticket', 'code', 'experience']);
      const list = ref([
        { service_code: 'pipeline', service_name: t('流水线') },
        { service_code: 'codecc', service_name: t('代码检查') },
        { service_code: 'bcs', service_name: t('容器服务') },
        { service_code: 'artifactory', service_name: t('版本仓库') },
        { service_code: 'ticket', service_name: t('凭证管理') },
        { service_code: 'code', service_name: t('代码库') },
        { service_code: 'experience', service_name: t('版本体验') },
        { service_code: 'environment', service_name: t('环境管理') },
      ]);

      const change = (sourceList, targetList, targetValueList) => {
        console.log(sourceList);
        console.log(targetList);
        console.log(targetValueList);
      };

      return {
        title,
        emptyContent,
        value,
        list,
        change,
      };
    },
  });
</script>
