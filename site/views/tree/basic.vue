<template>
  <div style="height: 300px; width: 100%; overflow: auto;">
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
