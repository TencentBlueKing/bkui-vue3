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
      <span>If the function function returns' default ', the system default style will be
        called</span>
      <bk-tree
        :data="treeData"
        level-line
        :prefix-icon="getPrefixIcon"
        label="name"
        children="children"
      />
    </div>
    <div class="cell">
      <span>Return string</span>
      <bk-tree
        :data="treeData"
        level-line
        :prefix-icon="getPrefixIcon2"
        label="name"
        children="children"
      />
    </div>
    <div class="cell">
      <span>Return object</span>
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

<script>
  import { defineComponent } from 'vue';

  import { BASIC_DATA } from '../../options';

  export default defineComponent({
    setup() {
      const treeData = [...BASIC_DATA];
      /**
       * Tree Prop: prefixIcon function
       * @param {} isRoot Whether it is a sub-heel node
       * @param {} hasChildNode Whether there are child nodes
       * @param {} isOpened Whether the current node is expanded
       * @param {} renderType Current render type (node_action: used to identify the current node status,
       *                     expand | collapse, node_type: node type, file, folder)
       */
      // eslint-disable-next-line no-unused-vars
      const getPrefixIcon = (item, renderType) => 'default';

      // eslint-disable-next-line no-unused-vars
      const getPrefixIcon2 = (item, renderType) => {
        const { isRoot } = item;
        if (renderType === 'node_action') {
          return 'default';
        }

        if (isRoot) {
          return null;
        }

        return 'Node-';
      };

      // eslint-disable-next-line no-unused-vars
      const getPrefixIcon3 = (item, renderType) => {
        const { isRoot } = item;
        if (renderType === 'node_action') {
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

      return {
        treeData,
        getPrefixIcon,
        getPrefixIcon2,
        getPrefixIcon3,
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
  width: 25%;
  padding: 0 15px;
  overflow: auto;
  border-right: solid 1px #ddd;
  flex: 1;
}
</style>
