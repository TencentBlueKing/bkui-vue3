<template>
  <div>
    <bk-process
      :controllable="state.controllable"
      :cur-process="state.curprocess"
      @click="processChanged"
    />
  </div>
</template>;
<script>
  import { defineComponent, reactive } from 'vue';

  export default defineComponent({
    setup() {
      const state = reactive({
        curprocess: 2,
        controllable: true,
      });

      // 改变当前选中值
      const processChanged = (index) => {
        state.curprocess = index;
      };

      return {
        state,
        processChanged,
      };
    },
  });
</script>
