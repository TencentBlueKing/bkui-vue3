<template>
  <div class="row">
    <div class="cell">
      <span>自定义节点</span>
      <bk-tree
        :data="treeData"
        level-line
        label="name"
        children="children"
      >
        <template #node="item">
          <h3>{{ item.name }}</h3>
        </template>
      </bk-tree>
    </div>
    <div class="cell">
      <span>自定义节点后缀</span>
      <bk-tree
        :data="treeData"
        level-line
        :prefix-icon="getPrefixIcon"
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

<script setup>
  import { BASIC_DATA } from './options';
  const treeData = [...BASIC_DATA];
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
  flex: 1;
  padding: 0 15px;
}
</style>
