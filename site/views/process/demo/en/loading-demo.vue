<template>
  <div>
    <bk-process
      :list="state.list"
      :cur-process="state.curprocess"
    />
  </div>
</template>
;
<script>
  import { defineComponent, reactive } from 'vue';

  export default defineComponent({
    setup() {
      const state = reactive({
        list: [
          { content: 'Test 1', description: 'This is the description' },
          { content: 'Test 2', description: 'This is description 2', status: 'loading' },
          { content: 'Test 3' },
          { content: 'Test 4' },
        ],
        curprocess: 2,
      });

      return {
        state,
      };
    },
  });
</script>
