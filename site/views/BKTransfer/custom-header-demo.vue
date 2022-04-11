<template>
  <bk-transfer
    :source-list="rtxList"
    :target-list="rtxValue"
    :display-key="'name'"
    :sort-key="'code'"
    :setting-key="'code'"
    :sortable="true"
    @change="change"
  >
    <template #left-header>
      <div class="left-header">
        <label>{{ '企业微信列表(' + sourceLength + ')' }}</label>
        <div class="add-all">
          <span
            v-if="sourceLength"
            @click="addAll"
          >选择全部</span>
          <span
            v-else
            class="disabled"
          >选择全部</span>
        </div>
      </div>
    </template>

    <template #right-header>
      <div class="right-header">
        <label>{{ '已选人员(' + targetLength + ')' }}</label>
        <div class="remove-all">
          <span
            v-if="targetLength"
            @click="removeAll"
          >全部移除</span>
          <span
            v-else
            class="disabled"
          >全部移除</span>
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
        未选择任何数据
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
      sourceLength: 0,
      targetLength: 0,
    };
  },
  methods: {
    change(sourceList, targetList, targetValueList) {
      this.sourceLength = sourceList.length;
      this.targetLength = targetList.length;
      console.log(sourceList);
      console.log(targetList);
      console.log(targetValueList);
    },
    addAll() {
      const list = [];
      this.rtxList.forEach((item) => {
        list.push(item.code);
      });
      this.rtxValue = [...list];
    },
    removeAll() {
      this.rtxValue = [];
    },
  },
};
</script>
<style lang="postcss">
  .left-header label,
  .right-header label {
    display: inline-block;
    font-size: 12px;
  }
  .add-all {
    display: inline-block;
    float: right;
    cursor: pointer;
    font-size: 14px;
    span {
      color: #3a84ff;
      &.disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
  }
  .add-all {
    display: inline-block;
    float: right;
    cursor: pointer;
    font-size: 12px;
  }
  .add-all span {
    color: #3a84ff;
  }
  .disabled  {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .remove-all {
    display: inline-block;
    float: right;
    cursor: pointer;
    font-size: 12px;
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
