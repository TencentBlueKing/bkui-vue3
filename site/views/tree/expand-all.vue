<template>
  <div style=" width: 100%;height: 300px; overflow: auto;">
    <bk-tree
      :data="treeData"
      label="name"
      children="children"
      show-checkbox
      level-line
      expand-all
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import { BASIC_DATA } from './options';
  export default defineComponent({
    components: {},
    setup() {
      return {
        treeData: [...(JSON.parse(JSON.stringify(BASIC_DATA)))],
      };
    },
  });
</script>
