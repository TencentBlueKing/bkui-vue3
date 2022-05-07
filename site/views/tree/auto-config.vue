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
      <span>默认选中：<code>data.checked = true</code></span>
      <bk-tree
        :data="autoCheck"
        label="name"
        children="children"
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
