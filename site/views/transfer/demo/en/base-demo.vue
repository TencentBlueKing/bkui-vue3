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

  import BkTransfer from '@bkui-vue/transfer';

  export default defineComponent({
    components: {
      BkTransfer,
    },
    setup() {
      const targetList = ref(['code']);
      const list = ref([
        { service_code: 'pipeline', service_name: 'Assembly line', disabled: true },
        { service_code: 'codecc', service_name: 'Code check' },
        { service_code: 'bcs', service_name: 'Container service' },
        { service_code: 'artifactory', service_name: 'Version warehouse' },
        { service_code: 'ticket', service_name: 'Voucher management' },
        { service_code: 'code', service_name: 'Code base', disabled: true },
        { service_code: 'experience', service_name: 'Version experience' },
        { service_code: 'environment', service_name: 'Environmental management' },
        { service_code: 'quality', service_name: 'Quality red line' },
        { service_code: 'turbo', service_name: 'Compilation acceleration' },
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
