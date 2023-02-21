<template>
  <bk-popover
    :content="content"
    theme="light xxxxx"
    width="400"
  >
    <div>
      When the mouse passes this text, a bubble box will be displayed
    </div>
  </bk-popover>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const content = ref('Here is the prompt text. When the mouse passes this text, a bubble box will be displayed. When the mouse passes this text, a bubble box will be displayed. When the mouse passes this text');
      return {
        content,
      };
    },
  });
</script>
