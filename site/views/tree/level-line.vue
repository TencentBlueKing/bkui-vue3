<template>
  <div style="height: 300px; width: 100%; overflow: auto; display: flex;">
    <div style="width: 50%;">
      <span>默认连线</span>
      <bk-tree
        :data="treeData"
        level-line
        label="name"
        children="children"
      />
    </div>
    <div style="width: 50%;">
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
