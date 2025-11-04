<template>
  <bk-button
    theme="primary"
    @click="handleDisableCheck"
  >
    {{ isDisableCheck ? '启用节点复选框' : '禁用节点复选框' }}
  </bk-button>
  <div style="width: 100%; height: 300px; overflow: auto">
    <bk-tree
      :data="treeData"
      :disable-check="isDisableCheck"
      children="children"
      label="name"
      level-line
      show-checkbox
      @node-click="handleNodeClick"
      @node-collapse="handleNodeCollapse"
      @node-expand="handleNodeExpand"
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
        treeData: [...JSON.parse(JSON.stringify(BASIC_DATA))],
        isDisableCheck: false,
      };
    },
    methods: {
      handleNodeClick(item, attrs, event) {
        console.log('handleNodeClick', item, attrs, event);
      },
      handleNodeExpand(item, attrs, event) {
        console.log('handleNodeExpand', item, attrs, event);
        Object.assign(this.treeData[0], { isOpen: true });
      },
      handleNodeCollapse(item, attrs, event) {
        setTimeout(() => {
          Object.assign(this.treeData[0], { isOpen: false });
        });

        console.log('handleNodeCollapse', item, attrs, event);
      },
      handleDisableCheck() {
        this.isDisableCheck = !this.isDisableCheck;
      },
    },
  });
</script>
