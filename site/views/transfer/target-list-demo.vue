<template>
  <bk-transfer
    :target-list="value"
    :source-list="list"
    :title="title"
    :empty-content="emptyContent"
    :display-key="'service_name'"
    :sort-key="'service_code'"
    :setting-key="'service_code'"
    :sortable="true"
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
      title: ['服务列表', '已选服务'],
      emptyContent: ['无数据', '未选择任何服务'],
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
      value: ['artifactory', 'ticket', 'code', 'experience'],
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
