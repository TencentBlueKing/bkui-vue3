<template>
  <div style=" width: 100%;height: 300px; overflow: auto;">
    <bk-tree
      :data="treeData"
      label="name"
      children="children"
      show-checkbox
      level-line
      :auto-open-parent-node="false"
      @node-click="handleNodeClick"
      @node-expand="handleNodeExpand"
      @node-collapse="handleNodeCollapse"
    />
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  import { BASIC_DATA } from '../../options';
  export default defineComponent({
    components: {},
    setup() {
      const treeData =  ref([...(JSON.parse(JSON.stringify(BASIC_DATA)))]);

      const handleNodeClick = (item, attrs, event) => {
        console.log('handleNodeClick', item, attrs, event);
      };

      const handleNodeExpand = (item, attrs, event) => {
        console.log('handleNodeExpand', item, attrs, event);
        Object.assign(this.treeData[0], { isOpen: true });
      };

      const handleNodeCollapse = (item, attrs, event) => {
        setTimeout(() => {
          Object.assign(this.treeData[0], { isOpen: false });
        });

        console.log('handleNodeCollapse', item, attrs, event);
      };

      return {
        treeData,
        handleNodeClick,
        handleNodeExpand,
        handleNodeCollapse,
      };
    },
    methods: {

    },
  });
</script>
