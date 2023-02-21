<template>
  <bk-popover
    :content="content"
    theme="light xxxxx"
    width="400"
  >
    <div>
      当鼠标通过此文本时，将显示一个气泡框
    </div>
  </bk-popover>
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
