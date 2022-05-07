<template>
  <div class="row">
    <div class="cell">
      <span>prefix-icon: true</span>
      <bk-tree
        :data="treeData"
        level-line
        prefix-icon
        label="name"
        children="children"
      />
    </div>
    <div class="cell">
      <span>function 函数返回 'default' 将会调用系统默认样式</span>
      <bk-tree
        :data="treeData"
        level-line
        :prefix-icon="getPrefixIcon"
        label="name"
        children="children"
      />
    </div>
    <div class="cell">
      <span>function 返回字符串</span>
      <bk-tree
        :data="treeData"
        level-line
        :prefix-icon="getPrefixIcon2"
        label="name"
        children="children"
      />
    </div>
    <div class="cell">
      <span>function 返回对象</span>
      <bk-tree
        :data="treeData"
        level-line
        :prefix-icon="getPrefixIcon3"
        label="name"
        children="children"
      />
    </div>
  </div>
</template>

<script setup>
  import { BASIC_DATA } from './options';
  const treeData = [...BASIC_DATA];
  /**
   * Tree Prop: prefixIcon function
   * @param {} isRoot 是否为分跟节点
   * @param {} hasChild 是否有孩子节点
   * @param {} isOpen 当前节点是否展开
   * @param {} renderType 当前渲染类型（action: 用来标识当前节点状态，展开 | 收起, node_type：节点类型，文件、文件夹）
   * @param {} item 当前节点数据
   */
  // eslint-disable-next-line no-unused-vars
  const getPrefixIcon = (isRoot, hasChild, isOpen, renderType, item) => 'default';

  // eslint-disable-next-line no-unused-vars
  const getPrefixIcon2 = (isRoot, hasChild, isOpen, renderType, item) => {
    if (renderType === 'action') {
      return 'default';
    }

    if (isRoot) {
      return null;
    }

    return 'Node-';
  };

  // eslint-disable-next-line no-unused-vars
  const getPrefixIcon3 = (isRoot, hasChild, isOpen, renderType, item) => {
    if (renderType === 'action') {
      return 'default';
    }

    if (isRoot) {
      return {
        node: 'span',
        className: 'custom-node custom-root',
        text: '0',
        style: {
          fontSize: '12px',
        },
      };
    }

    return {
      node: 'span',
      className: 'custom-node',
      text: '1',
      style: {
        fontSize: '8px',
      },
    };
  };
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
  width: 25%;
  padding: 0 15px;
  overflow: auto;
  border-right: solid 1px #ddd;
  flex: 1;
}
</style>
