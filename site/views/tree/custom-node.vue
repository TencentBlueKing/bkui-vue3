<template>
  <div class="row">
    <div class="cell">
      <span>{{ t("自定义节点内容") }}</span>
      <bk-tree
        :data="treeData"
        level-line
        label="name"
        children="children"
      >
        <template #node="item">
          <span style="color: #3a84ff;">({{ t("自定义节点") }})：{{ item.name }}</span>
        </template>
      </bk-tree>
    </div>
    <div class="cell">
      <span>{{ t("自定义节点展开\收起") }}</span>
      <bk-tree
        :data="treeData"
        level-line
        label="name"
        children="children"
      >
        <template #nodeAction="item">
          <span
            :style="`color: ${item.__attr__.isOpen ? '#FF9C01;' : '#EA3636;'}`"
          >
            {{ item.__attr__.hasChildNode ? (item.__attr__.isOpen ? '--' : '+') : '*' }}
          </span>
        </template>
      </bk-tree>
    </div>
    <div class="cell">
      <span>{{ t('自定义节点类型') }}</span>
      <bk-tree
        :data="treeData"
        level-line
        label="name"
        children="children"
      >
        <template #nodeType="item">
          <span style="padding: 0 5px;">
            {{ item.__attr__.hasChildNode ? 'P' : 'C' }}
          </span>
        </template>
      </bk-tree>
    </div>
    <div class="cell">
      <span>{{ t('自定义节点后缀') }}</span>
      <bk-tree
        :data="treeData"
        level-line
        label="name"
        children="children"
      >
        <template #nodeAppend>
          <span style="padding: 0 5px; color: red;">Append</span>
        </template>
      </bk-tree>
    </div>
  </div>
</template>

<script>
  import { useI18n } from 'vue-i18n';

  import { defineComponent } from '@vue/runtime-core';

  import { BASIC_DATA } from './options';
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      return {
        treeData: [...BASIC_DATA],
        t,
      };
    },
  });
</script>
<style>
.custom-node {
  display: flex;
  width: 18px;
  height: 18px;
  padding: 0 5px;
  margin: 0 2px 0 0;
  background: #cccc;
  align-items: center;
}

.custom-root {
  background: #fafb;
}
</style>
<style scoped>
.row {
  display: flex;
  width: 100%;
  height: 300px;
  overflow: auto;
}

.cell {
  padding: 0 15px;
  overflow: auto;
  border-right: solid 1px #ddd;
  flex: 1;
}
</style>
