<template>
  <div>
    <bk-timeline
      :list="state.list"
      @select="timeLineChanged"
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
            size: 'large',
          },
          {
            tag: 'Step 1',
            content: '<span style="font-size: 12px;">2019-12-15 11:00</span>',
          },
          {
            tag: 'Step 2',
            content: '<span style="font-size: 12px;">2020-12-15 11:00</span>',
          },
          {
            tag: 'Step 3',
            content: '<span style="font-size: 12px;">2021-12-15 11:00</span>',
          },
          {
            tag: 'Step 4',
            content: '<span style="font-size: 12px;">2022-12-15 11:00</span>',
          },
        ],
      });

      const timeLineChanged = (data) => {
        alert(`Selected: ${data.tag}`);
      };

      return {
        state,
        timeLineChanged,
      };
    },
  });
</script>
