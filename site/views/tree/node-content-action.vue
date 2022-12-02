<template>
  <div style="width: 100%; overflow: auto">
    <div class="row">
      <div class="column">
        <div class="attr-tag">
          node-content-action = ['selected', 'click', 'expand'] | (默认配置)
        </div>
        <div class="cell">
          <bk-tree
            :data="treeData"
            label="name"
            children="children"
            :node-content-action="['selected', 'click', 'expand']"
          />
        </div>
      </div>
      <div class="column">
        <div class="attr-tag">
          node-content-action =['selected', 'click']
        </div>
        <div class="cell">
          <bk-tree
            :data="treeData"
            label="name"
            :node-content-action="['selected', 'click']"
            children="children"
          />
        </div>
      </div>
      <div class="column">
        <div class="attr-tag">
          node-content-action =[] | (如果要禁用所有行为请设置为[],不要设置null|undefined之类，这类设置会被置换为默认配置)
        </div>
        <div class="cell">
          <bk-tree
            :data="treeData"
            label="name"
            :node-content-action="[]"
            children="children"
          />
        </div>
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
  padding-top: 15px;
}

.column {
  width: 33%;
}

.cell {
  height: 300px;
  padding: 0 15px;
  overflow: auto;
  border-right: solid 1px #ddd;
  flex: 1;
}

.attr-tag {
  padding: 10px;
  margin-right: 2px;
  background: #f0f1f5;
}
</style>
