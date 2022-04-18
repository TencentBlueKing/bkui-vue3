<template>
  <div class="row">
    <div class="cell">
      <span>默认连线</span>
      <bk-tree
        :data="treeData"
        level-line
        label="name"
        children="children"
      />
    </div>
    <div class="cell">
      <span>自定义连线</span>
      <bk-tree
        :data="treeData"
        :level-line="'solid 1px red'"
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
  });
</script>
<style scoped>
.row {
  height: 300px;
  width: 100%;
  overflow: auto;
  display: flex;
}

.cell {
  flex: 1;
  padding: 0 15px;
}
</style>
