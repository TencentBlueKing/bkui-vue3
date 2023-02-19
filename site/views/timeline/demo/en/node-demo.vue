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
            type: 'default',
          },
          {
            tag: 'Step 1',
            content: '<span style="font-size: 12px;">2019-12-15 11:00</span>',
            type: 'primary',
          },
          {
            tag: 'Step 2',
            content: '<span style="font-size: 12px;">2020-12-15 11:00</span>',
            type: 'warning',
          },
          {
            tag: 'Step 3',
            content: '<span style="font-size: 12px;">2021-12-15 11:00</span>',
            type: 'success',
          },
          {
            tag: 'Step 4',
            content: '<span style="font-size: 12px;">2022-12-15 11:00</span>',
            type: 'danger',
          },
        ],
      });

      return {
        state,
      };
    },
  });

</script>
