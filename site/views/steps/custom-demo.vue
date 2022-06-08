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
  import { defineComponent, reactive } from 'vue';

  import { Bk } from '@bkui-vue/icon';

  export default defineComponent({
    setup() {
      const state = reactive({
        objectSteps: [
          { title: '测试一', icon: Bk, description: '这是描述' },
          { title: '测试二', icon: 2, description: '这是描述2', status: 'error' },
          { title: '测试三', icon: 3  },
          { title: '测试四' },
        ],
        curStep: 1,
        controllable: true,
      });


      // 改变当前选中值
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
  margin-bottom: 20px
}
</style>
