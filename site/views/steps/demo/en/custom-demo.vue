<template>
  <div>
    <bk-steps
      :controllable="state.controllable"
      :cur-step="state.curStep"
      :steps="state.objectSteps"
      class="mb20"
      @click="stepChanged"
    />
  </div>
</template>
<script>
  import { Bk } from 'bkui-vue/lib/icon';
  import { defineComponent, reactive } from 'vue';

  export default defineComponent({
    setup() {
      const state = reactive({
        objectSteps: [
          { title: 'Test 1', icon: Bk, description: 'This is the description' },
          { title: 'Test 2', icon: 2, description: 'This is description 2', status: 'error' },
          { title: 'Test 3', icon: 3 },
          { title: 'Test 4' },
        ],
        curStep: 1,
        controllable: true,
      });

      const stepChanged = (index) => {
        state.curStep = index;
      };

      return {
        state,
        stepChanged,
      };
    },
  });
</script>
<style>
.mb20 {
  margin-bottom: 20px;
}
</style>
