<template>
  <div>
    <bk-process
      :list="state.list"
      :cur-process="state.curprocess"
    />
  </div>
</template>;
<script>
  import { defineComponent, reactive } from 'vue';

  export default defineComponent({
    setup() {
      const state = reactive({
        list: [
          { content: '测试一',  description: '这是描述' },
          { content: '测试二',  description: '这是描述2', status: 'loading' },
          { content: '测试三' },
          { content: '测试四' },
        ],
        curprocess: 2,
      });

      return {
        state,
      };
    },
  });
</script>
