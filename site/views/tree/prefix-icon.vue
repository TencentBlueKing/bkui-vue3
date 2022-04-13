<template>
  <div style="height: 300px; width: 100%; overflow: auto; display: flex;">
    <div style="width: 25%;">
      <span>prefix-icon: true</span>
      <bk-tree
        :data="treeData"
        :level-line="true"
        :prefix-icon="true"
        label="name"
        children="children"
      />
    </div>
    <div style="width: 25%;">
      <span>function 函数返回 'default' 将会调用系统默认样式</span>
      <bk-tree
        :data="treeData"
        :level-line="true"
        :prefix-icon="getPrefixIcon"
        label="name"
        children="children"
      />
    </div>
    <div style="width: 25%;">
      <span>function 返回字符串</span>
      <bk-tree
        :data="treeData"
        :level-line="true"
        :prefix-icon="getPrefixIcon2"
        label="name"
        children="children"
      />
    </div>
    <div style="width: 25%;">
      <span>function 返回对象</span>
      <bk-tree
        :data="treeData"
        :level-line="true"
        :prefix-icon="getPrefixIcon3"
        label="name"
        children="children"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { BASIC_DATA } from './options';
export default defineComponent({
  components: {},
  data() {
    return {
      treeData: [...BASIC_DATA],
    };
  },
  methods: {
    /**
     * Tree Prop: prefixIcon function
     * @param {} isRoot 是否为分跟节点
     * @param {} hasChild 是否有孩子节点
     * @param {} isOpen 当前节点是否展开
     * @param {} renderType 当前渲染类型（action: 用来标识当前节点状态，展开 | 收起, node_type：节点类型，文件、文件夹）
     * @param {} item 当前节点数据
     */
    // eslint-disable-next-line no-unused-vars
    getPrefixIcon(isRoot, hasChild, isOpen, renderType, item) {
      // console.info(isRoot, hasChild, isOpen, renderType, item);
      return 'default';
    },

    // eslint-disable-next-line no-unused-vars
    getPrefixIcon2(isRoot, hasChild, isOpen, renderType, item) {
      if (renderType === 'action') {
        return 'default';
      }

      if (isRoot) {
        return null;
      }

      return 'Node-';
    },

    // eslint-disable-next-line no-unused-vars
    getPrefixIcon3(isRoot, hasChild, isOpen, renderType, item) {
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
            textAlign: 'center',
          },
        };
      }

      return {
        node: 'span',
        className: 'custom-node',
        text: '1',
        style: {
          fontSize: '8px',
          textAlign: 'center',
        },
      };
    },
  },
});
</script>
<style>
.custom-node {
  padding: 0 5px;
  margin: 0 2px 0 0;
  width: 18px;
  height: 18px;
  background: #cccc;
}

.custom-root {
  background: #fafb;
}
</style>
