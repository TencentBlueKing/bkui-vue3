<template>
  <div>
    <bk-steps
      :controllable="controllable"
      :cur-step="state.curStep"
      @click="stepChanged"
    />
  </div>
</template>
<script>
  import { defineComponent, reactive, ref } from 'vue';

  export default defineComponent({
    setup() {
      const controllable = ref(true);

      const state = reactive({
        curStep: 1,
      });

      const stepChanged = (index) => {
        state.curStep = index;
      };
      return {
        controllable,
        state,
        stepChanged,
      };
    },
  });
</script>
