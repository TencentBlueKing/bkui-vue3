<template>
  <div style="width: 100%; overflow: auto;">
    <div class="row">
      <bk-tree
        :data="treeData"
        label="name"
        children="children"
        draggable
        :disable-drag="disableDrag"
        :disable-drop="disableDrop"
      >
        <template #node="item">
          <div>
            isFolder：{{ String(item.isFolder) }},
            disDraggable：{{ String(item.disabled) }},
            <span style="color: #3a84ff;">{{ item.name }}</span>，
          </div>
        </template>
      </bk-tree>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import { DRAG_TEST_DATA } from './options';
  export default defineComponent({
    components: {},
    data() {
      return {
        treeData: [...DRAG_TEST_DATA],
        disableDrag: node => node.disabled,
        disableDrop: node => !node.isFolder,
      };
    },
  });
</script>
<style scoped>
.row {
  display: flex;
  width: 100%;
  height: 300px;
  padding-top: 15px;
  overflow: auto;

}

.cell {
  padding: 0 15px;
  overflow: auto;
  border-right: solid 1px #ddd;
  flex: 1;
}
</style>
