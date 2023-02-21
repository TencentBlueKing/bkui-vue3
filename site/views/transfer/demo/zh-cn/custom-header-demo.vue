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
    <template #left-header>
      <div class="left-header">
        <label>企业微信列表({{ sourceLength }})</label>
        <div class="add-all">
          <span
            v-if="sourceLength"
            @click="addAll"
          >选择所有</span>
          <span
            v-else
            class="disabled"
          >选择所有</span>
        </div>
      </div>
    </template>

    <template #right-header>
      <div class="right-header">
        <label>选定的人员({{ targetLength }})</label>
        <div class="remove-all">
          <span
            v-if="targetLength"
            @click="removeAll"
          >移除所有</span>
          <span
            v-else
            class="disabled"
          >移除所有</span>
        </div>
      </div>
    </template>

    <template #left-empty-content>
      <div class="empty-content">
        数据为空
      </div>
    </template>

    <template #right-empty-content>
      <div class="empty-content">
        未选择数据
      </div>
    </template>
  </bk-transfer>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  import BkTransfer from '@bkui-vue/transfer';

  export default defineComponent({
    components: {
      BkTransfer,
    },
    setup() {
      const rtxList = ref([
        { name: 'zhangsan', code: 1 },
        { name: 'lisi', code: 2 },
        { name: 'laowang', code: 3 },
        { name: 'zhaosi', code: 4 },
        { name: 'liuer', code: 5 },
        { name: 'zhousan', code: 6 },
        { name: 'huangwu', code: 7 },
        { name: 'tianliu', code: 8 },
      ]);
      const rtxValue = ref([1, 5, 7]);
      const sourceLength = ref(5);
      const targetLength = ref(3);

      const change = (sourceList, targetList, targetValueList) => {
        sourceLength.value = sourceList.length;
        targetLength.value = targetList.length;
        console.log(sourceList);
        console.log(targetList);
        console.log(targetValueList);
      };

      const addAll = () => {
        const list = [];
        rtxList.value.forEach((item) => {
          list.push(item.code);
        });
        rtxValue.value = [...list];
      };

      const removeAll = () => {
        rtxValue.value = [];
      };

      return {
        rtxList,
        rtxValue,
        sourceLength,
        targetLength,
        change,
        addAll,
        removeAll,
      };
    },
  });
</script>

<style lang="postcss">
.left-header,
.right-header {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;

  label {
    font-size: 12px;
  }
}

.add-all {
  font-size: 14px;
  cursor: pointer;

  span {
    color: #3a84ff;

    &.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}

.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.remove-all {
  font-size: 12px;
  cursor: pointer;
}

.remove-all span {
  color: #ea3636;
}

.empty-content {
  position: relative;
  top: 145px;
  text-align: center;
}
</style>
