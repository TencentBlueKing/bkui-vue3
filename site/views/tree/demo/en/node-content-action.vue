<template>
  <div style="width: 100%; overflow: auto">
    <div class="row">
      <div class="column">
        <div class="attr-tag">
          node-content-action = ['selected', 'click', 'expand'] | Default configuration
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
          node-content-action =[] | If you want to disable all behaviors, please set it to
          [], and do not set null | undefined and so on. Such settings will be replaced by
          the default configuration
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
  import { defineComponent, ref } from 'vue';

  import { BASIC_DATA } from '../../options';

  export default defineComponent({
    components: {},
    setup() {
      const treeData = ref([...JSON.parse(JSON.stringify(BASIC_DATA))]);

      return {
        treeData,
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
