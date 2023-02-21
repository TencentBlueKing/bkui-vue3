<template>
  <bk-popover
    placement="bottom"
    :content="'文本提示'"
    @after-hidden="handleHide"
    @after-show="handleShow"
  >
    <bk-button>自定义回调函数</bk-button>
  </bk-popover>
</template>

<script>
  import { defineComponent } from 'vue';

  import BkMessage from '@bkui-vue/message';
  export default defineComponent({
    setup() {
      const handleShow = () => {
        BkMessage({
          theme: 'success',
          message: 'onShow',
        });
      };

      const handleHide = () => {
        BkMessage({
          theme: 'error',
          message: 'onClose',
        });
      };

      return {
        handleShow,
        handleHide,
      };
    },
  });
</script>
