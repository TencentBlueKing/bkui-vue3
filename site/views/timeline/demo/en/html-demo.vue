<template>
  <div>
    <bk-timeline
      :list="state.list"
    />
  </div>
</template>
<script>
  import { defineComponent, reactive } from 'vue';


  export default defineComponent({
    setup() {
      const state = reactive({
        list: [
          {
            tag: 'One day ago',
            content: 'Go online from pony to blue whale market',
          },
          {
            tag: 'Step 1',
            content: '<div style="color: red;">From<strong> tony </strong> deploy to production environment and publish to application market</div>',
          },
          {
            tag: 'Step 2',
            content: '<div>From<strong> allen </strong>go online to <span style="color: #3c96ff;">blue king market</span></div>',
          },
          {
            tag: 'Step 3',
            content: 'From<strong> tony </strong>deploy to <p style="color: #ff5656">production environment</p> and publish to <strong>application market</strong>',
          },
          {
            tag: 'Step 4',
            content: 'From<strong> allen </strong>deploy to pre-release environment',
          },
        ],
      });

      return {
        state,
      };
    },
  });

</script>
