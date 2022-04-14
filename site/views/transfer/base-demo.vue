<template>
  <bk-transfer
    :source-list="list"
    :display-key="'service_name'"
    :setting-key="'service_code'"
    :show-overflow-tips="true"
    @change="change"
  />
</template>
<script>
import BkTransfer from '@bkui-vue/transfer';

export default {
  components: {
    BkTransfer,
  },
  data() {
    return {
      list: [
        { service_code: 'pipeline', service_name: '流水线' },
        { service_code: 'codecc', service_name: '代码检查' },
        { service_code: 'bcs', service_name: '容器服务' },
        { service_code: 'artifactory', service_name: '版本仓库' },
        { service_code: 'ticket', service_name: '凭证管理' },
        { service_code: 'code', service_name: '代码库' },
        { service_code: 'experience', service_name: '版本体验' },
        { service_code: 'environment', service_name: '环境管理' },
      ],
    };
  },
  methods: {
    change(sourceList, targetList, targetValueList) {
      console.log(sourceList);
      console.log(targetList);
      console.log(targetValueList);
    },
  },
};
</script>
