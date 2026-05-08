<template>
  <div style="width: 100%; overflow: auto">
    <div class="row">
      <div class="column">
        <span>draggable + nodeDataChange: <code>draggable = true</code></span>
        <div class="cell">
          <bk-tree
            :data="treeData1"
            children="children"
            label="name"
            node-key="id"
            drag-target-open-state="collapse"
            draggable
            @node-data-change="handleDataChange1"
          />
        </div>
      </div>
      <div class="column">
        <span>drag-sort + nodeDataChange: <code>drag-sort = true</code></span>
        <div class="cell">
          <bk-tree
            :data="treeData1"
            children="children"
            label="name"
            node-key="id"
            drag-sort
            draggable
            @node-data-change="handleDataChange1"
          />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="column">
        <span>drag-sort-mode="next" + nodeDataChange: 仅允许同级前后拖拽</span>
        <div class="cell">
          <bk-tree
            :data="treeData2"
            children="children"
            label="name"
            node-key="id"
            drag-sort
            draggable
            drag-sort-mode="next"
            drag-target-open-state="expand"
            @node-data-change="handleDataChange2"
            @drag-sort="onDragSort"
          />
        </div>
      </div>
      <div class="column">
        <span>disable-drag / disable-drop + nodeDataChange: 自定义拖拽权限</span>
        <div class="cell">
          <bk-tree
            :data="treeData2"
            children="children"
            label="name"
            node-key="id"
            draggable
            :disable-drag="disableDrag"
            :disable-drop="disableDrop"
            @node-data-change="handleDataChange2"
            @drop="onDrop"
          >
            <template #node="item">
              <div>
                <span style="color: #3a84ff">{{ item.name }}</span>
                <span v-if="item.disabled" style="color: #999; margin-left: 8px">(不可拖拽)</span>
              </div>
            </template>
          </bk-tree>
        </div>
      </div>
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
        treeData1: [...DRAG_TEST_DATA],
        treeData2: [...DRAG_TEST_DATA],
      };
    },
    methods: {
      handleDataChange1(payload) {
        // nodeDataChange 回调：用 payload.data 替换当前 data，实现拖拽后数据同步
        this.treeData1 = payload.data;
      },
      handleDataChange2(payload) {
        this.treeData2 = payload.data;
      },
      disableDrag(node) {
        return node.disabled;
      },
      disableDrop(node, type, target) {
        // 不允许拖拽到 disabled 节点
        return target.disabled;
      },
      onDragSort(payload) {
        console.log('drag-sort', payload);
      },
      onDrop(payload) {
        console.log('drop', payload);
      },
    },
  });
</script>
<style scoped>
  @import './tree.less';
</style>
