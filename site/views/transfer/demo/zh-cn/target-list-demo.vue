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

  import BkTransfer from '@bkui-vue/transfer';

  export default defineComponent({
    components: {
      BkTransfer,
    },
    setup() {
      const title = ref(['Service list', 'Selected services']);
      const emptyContent = ref(['No data', 'No service selected']);
      const value = ref(['artifactory', 'ticket', 'code', 'experience']);
      const list = ref([
        { service_code: 'pipeline', service_name: 'Assembly line' },
        { service_code: 'codecc', service_name: 'Code check' },
        { service_code: 'bcs', service_name: 'Container service' },
        { service_code: 'artifactory', service_name: 'Version warehouse' },
        { service_code: 'ticket', service_name: 'Voucher management' },
        { service_code: 'code', service_name: 'Code base', disabled: true },
        { service_code: 'experience', service_name: 'Version experience' },
        { service_code: 'environment', service_name: 'Environmental management' },
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
