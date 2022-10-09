<template>
  <div>
    <bk-process
      :list="state.list"
      :controllable="state.controllable"
      :cur-process="state.curprocess"
      @click="processChanged"
    />
  </div>
</template>;
<script>
  import { defineComponent, reactive } from 'vue';

  import { Bk } from '@bkui-vue/icon';

  export default defineComponent({
    setup() {
      const state = reactive({
        list: [
          { content: '测试一', description: '这是描述' },
          { content: '测试二', description: '这是描述2', status: 'loading' },
          { content: '测试三', description: '这是描述3', status: 'error'  },
          { content: '测试四', description: '这是描述4', icon: Bk },
          { content: '测试五', description: '这是描述5' },
        ],
        controllable: true,
        curprocess: 3,
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
