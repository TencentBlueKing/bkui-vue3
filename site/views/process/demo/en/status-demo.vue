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
  import { Bk } from 'bkui-vue/lib/icon';
  import { defineComponent, reactive } from 'vue';

  export default defineComponent({
    setup() {
      const state = reactive({
        list: [
          { content: 'Test 1',  description: 'This is the description' },
          { content: 'Test 2',  description: 'This is description 2', status: 'loading' },
          { content: 'Test 3', description: 'This is description 3',  status: 'error' },
          { content: 'Test 4', description: 'This is description 4', icon: Bk },
          { content: 'Test 5', description: 'This is description 5' },
        ],
        controllable: true,
        curprocess: 3,
      });


      const processChanged = (index) => {
        state.curprocess = index;
      };

      return {
        state,
        processChanged,
      };
    },
  });;
</script>
