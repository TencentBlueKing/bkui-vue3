<template>
  <div class="row">
    <div class="cell">
      <span>默认连线: <code>level-line="true"</code></span>
      <bk-tree
        :data="treeData"
        level-line
        label="name"
        children="children"
      />
    </div>
    <div class="cell">
      <span>默认展开：<code>data.isOpen = true</code></span>
      <bk-tree
        :data="autoOpen"
        label="name"
        children="children"
      />
    </div>
    <div class="cell">
      <bk-button @click="handleAutoSelect">
        设置选中节点
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
  import { defineComponent } from 'vue';

  import { AUTO_CHECKED_DATA, AUTO_OPEN_DATA, BASIC_DATA } from './options';
  export default defineComponent({
    components: {},
    data() {
      return {
        treeData: [...BASIC_DATA],
        autoOpen: [...AUTO_OPEN_DATA],
        autoCheck: [...AUTO_CHECKED_DATA],
        selected: null,
      };
    },
    methods: {
      handleAutoSelect() {
        const treeData = this.$refs.refAutoSelect.getData();
        const { length } = treeData.data;
        const randomIndex = Math.floor(Math.random() * length);
        this.selected = treeData.data[randomIndex];
      },
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
