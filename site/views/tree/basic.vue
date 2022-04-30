<template>
  <div style=" width: 100%;height: 300px; overflow: auto;">
    <bk-tree
      :data="treeData"
      label="name"
      children="children"
    />
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
