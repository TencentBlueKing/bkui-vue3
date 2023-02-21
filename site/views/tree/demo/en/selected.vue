<template>
  <div style="width: 100%; height: 300px; overflow: auto">
    <div>
      <bk-input
        v-model="selectText"
        style="width: 120px; margin: 0 15px 0 0"
      />
      <bk-button @click="handleSelect">
        Test selected
      </bk-button>
    </div>
    <bk-tree
      ref="refAutoSelect"
      :data="treeData"
      label="name"
      children="children"
      show-checkbox
      level-line
      node-key="id"
      :selected="selected"
      :auto-open-parent-node="false"
      @node-click="handleNodeClick"
      @node-expand="handleNodeExpand"
      @node-collapse="handleNodeCollapse"
    />
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  import { SELECTED_DATA } from '../../options';

  export default defineComponent({
    components: {},
    setup() {
      const selectText = ref('2');
      const selected = ref(['2']);
      const  treeData = ref(SELECTED_DATA);

      const handleSelect = () => {
        selected.value = [selectText.value];
      };

      const handleNodeExpand = () => {};

      const handleNodeClick = () => {};

      const handleNodeCollapse = () => {};

      return {
        selectText,
        selected,
        treeData,
        handleSelect,
        handleNodeExpand,
        handleNodeClick,
        handleNodeCollapse,
      };
    },
  });
</script>
