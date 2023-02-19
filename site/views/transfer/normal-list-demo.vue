<template>
  <bk-transfer
    :source-list="generalList"
    :target-list="generalValue"
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
      const generalList = ref([1, 4, 9, 'ab', 8, 5, 'bc', 3]);
      const generalValue = ref([1, 4, 9, 'bc']);

      const change = (sourceList, targetList, targetValueList) => {
        console.log(sourceList);
        console.log(targetList);
        console.log(targetValueList);
      };

      return {
        generalList,
        generalValue,
        change,
      };
    },
  });
</script>
