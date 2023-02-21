<template>
  <div class="row">
    <div class="cell">
      <span>Default connection: <code>level-line="true"</code></span>
      <bk-tree
        :data="treeData"
        level-line
        label="name"
        children="children"
      />
    </div>
    <div class="cell">
      <span>Default deployment: <code>data.isOpen = true</code></span>
      <bk-tree
        :data="autoOpen"
        label="name"
        children="children"
        :auto-open-parent-node="false"
      />
    </div>
    <div class="cell">
      <bk-button @click="handleAutoSelect">
        Set selected node
      </bk-button>
      <bk-tree
        ref="refAutoSelect"
        :data="autoCheck"
        label="name"
        children="children"
        :selected="selected"
      />
    </div>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  import { AUTO_CHECKED_DATA, AUTO_OPEN_DATA, BASIC_DATA } from '../../options';

  export default defineComponent({
    components: {},
    setup() {
      const refAutoSelect = ref();
      const selected = ref(null);
      const treeData = ref([...BASIC_DATA]);
      const autoOpen = ref([...AUTO_OPEN_DATA]);
      const autoCheck = ref([...AUTO_CHECKED_DATA]);

      const handleAutoSelect = () => {
        const treeData = refAutoSelect.value?.getData();
        const { length } =  treeData.value?.data;
        const randomIndex = Math.floor(Math.random() * length);
        selected.value = treeData.value?.data[randomIndex];
      };

      return {
        refAutoSelect,
        selected,
        treeData,
        autoOpen,
        autoCheck,
        handleAutoSelect,
      };
    },
  });
</script>
<style scoped>
.row {
  display: flex;
  width: 100%;
  height: 300px;
  overflow: auto;
}

.cell {
  width: 33%;
  padding: 0 15px;
  overflow: auto;
  border-right: solid 1px #ddd;
  flex: 1;
}
</style>
