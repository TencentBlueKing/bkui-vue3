<template>
  <bk-popover2
    placement="bottom"
    content="文字提示"
    @after-hidden="handleHide"
    @after-show="handleShow"
  >
    <bk-button>自定义回调函数</bk-button>
  </bk-popover2>
</template>

<script setup>
  import BkMessage from '@bkui-vue/message';

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
</script>
