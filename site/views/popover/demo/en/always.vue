<template>
  <bk-popover
    always
    boundary="#oooxxxvvv"
    placement="right"
    width="300"
    :content="content"
  >
    <bk-button>Always show</bk-button>
  </bk-popover>
  <div id="oooxxxvvv" />
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
