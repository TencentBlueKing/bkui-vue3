<template>
  <bk-popover
    always
    boundary="#oooxxxvvv"
    placement="right"
    width="300"
    :content="content"
  >
    <bk-button>总是显示</bk-button>
  </bk-popover>
  <div id="oooxxxvvv" />
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const content = ref('这是提示文本。当鼠标通过此文本时，将显示一个气泡框。当鼠标通过此文本时，将显示一个气泡框。当鼠标通过此文本时');
      return {
        content,
      };
    },
  });
</script>
