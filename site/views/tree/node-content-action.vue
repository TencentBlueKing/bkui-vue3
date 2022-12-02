<template>
  <div style="width: 100%; overflow: auto">
    <div class="row">
      <div class="cell">
        <span class="attr-tag">nodeContentAction = ['selected', 'expand', 'click']</span>
        <bk-tree
          :data="treeData"
          label="name"
          children="children"
          :node-content-action="['selected', 'click']"
        />
      </div>
      <div class="cell">
        <span class="attr-tag">nodeContentAction =[]</span>
        <bk-tree
          :data="treeData"
          label="name"
          :node-content-action="[]"
          children="children"
        />
      </div>
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
        treeData: [...JSON.parse(JSON.stringify(BASIC_DATA))],
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

.attr-tag {
  display: inline-block;
  width: 100%;
  padding: 10px;
  background: #f0f1f5;
}
</style>
