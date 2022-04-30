<template>
  <bk-transfer
    :source-list="rtxList"
    :target-list="rtxValue"
    :display-key="'name'"
    :sort-key="'code'"
    :setting-key="'code'"
    sortable
    @change="change"
  >
    <template #source-option="data">
      <div>
        code: {{ data.code }}, name: {{ data.name }}
      </div>
    </template>
    <template #target-option="data">
      <div>
        code: {{ data.code }}, name: {{ data.name }}
      </div>
    </template>
  </bk-transfer>
</template>
<script>
  import BkTransfer from '@bkui-vue/transfer';

  export default {
    components: {
      BkTransfer,
    },
    data() {
      return {
        rtxList: [
          { name: 'zhangsan', code: 1 },
          { name: 'lisi', code: 2 },
          { name: 'laowang', code: 3 },
          { name: 'zhaosi', code: 4 },
          { name: 'liuer', code: 5 },
          { name: 'zhousan', code: 6 },
          { name: 'huangwu', code: 7 },
          { name: 'tianliu', code: 8 },
        ],
        rtxValue: [1, 5, 7],
      };
    },
  };
</script>
