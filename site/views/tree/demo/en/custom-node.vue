<template>
  <div class="row">
    <div class="cell">
      <span>Custom node content</span>
      <bk-tree
        :data="treeData"
        level-line
        label="name"
        children="children"
      >
        <template #node="item">
          <span style="color: #3a84ff;">Custom node: {{ item.name }}</span>
        </template>
      </bk-tree>
    </div>
    <div class="cell">
      <span>Custom node expansion/collection</span>
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
      <span>Custom node type</span>
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
      <span>Custom node suffix</span>
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
  import { defineComponent } from 'vue';

  import { BASIC_DATA } from '../../options';
  export default defineComponent({
    setup() {
      return {
        treeData: [...BASIC_DATA],
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
