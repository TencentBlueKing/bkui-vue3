<template>
  <div style="width: 100%; height: 300px; overflow: auto">
    <div>
      <bk-input
        v-model="selectText"
        style="width: 120px; margin: 0 15px 0 0"
      />
      <bk-button @click="handleSelect">
        {{ t('测试选中') }}
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
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { SELECTED_DATA } from './options';

  export default defineComponent({
    components: {},
    data() {
      return {
        selectText: '2',
        selected: ['2'],
        treeData: SELECTED_DATA,
        t: useI18n().t,
      };
    },
    methods: {
      handleSelect() {
        this.selected = [this.selectText];
      },
      handleNodeExpand() {},
      handleNodeClick() {},
      handleNodeCollapse() {},
    },
  });
</script>
