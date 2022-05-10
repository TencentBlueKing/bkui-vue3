<template>
  <div style=" width: 100%;height: 300px; overflow: auto;">
    <bk-tree
      :data="treeData"
      label="name"
      children="children"
      @node-click="handleNodeClick"
      @node-expand="handleNodeExpand"
      @node-collapse="handleNodeCollapse"
    />
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
      handleNodeClick(item, attrs, event) {
        console.log('handleNodeClick', item, attrs, event);
      },
      handleNodeExpand(item, attrs, event) {
        console.log('handleNodeExpand', item, attrs, event);
      },
      handleNodeCollapse(item, attrs, event) {
        console.log('handleNodeCollapse', item, attrs, event);
      },
    },
  });
</script>
