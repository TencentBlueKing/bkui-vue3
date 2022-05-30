<template>
  <div>
    <bk-steps
      :steps="state.objectSteps"
      class="mb20"
    >
      <span><error /></span>
    </bk-steps>
    <!-- <error /> -->
  </div>
</template>
<script>
  import { defineComponent, reactive, ref } from 'vue';

  import { Error } from '@bkui-vue/icon';

  export default defineComponent({
    components: {
      Error,
    },
    setup() {
      const controllable = ref(true);

      // const render = () => (
      //   1
      // );

      const state = reactive({
        objectSteps: [
          { title: '测试一', icon: 1, description: '这是描述' },
          { title: '测试二', icon: 2, description: '这是描述2', status: 'error' },
          { title: '测试三', icon: 3  },
          { title: '测试四' },
        ],
        curStep: 2,
      });


      // 改变当前选中值
      const stepChanged = (index) => {
        state.curStep = index;
      };
      return {
        controllable,
        state,
        stepChanged,
        // render,
      };
    },
  });

</script>
<style>
.mb20 {
  margin-bottom: 20px
}
</style>
