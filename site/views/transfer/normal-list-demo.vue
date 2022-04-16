<template>
  <bk-transfer
    :source-list="generalList"
    :target-list="generalValue"
    sortable
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
        generalList: [1, 4, 9, 'ab', 8, 5, 'bc', 3],
        generalValue: [1, 4, 9, 'bc'],
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
