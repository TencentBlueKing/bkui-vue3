<template>
  <bk-button @click="handlePopMsgBtn">
    点击初始化Popover
  </bk-button>
  <bk-button @click="handleShowPop">
    show
  </bk-button>
  <bk-button
    @click="handleHidePop"
    @mousemove="handleMouseMove"
  >
    close
  </bk-button>
</template>
<script setup>
  import $bkPopover from '@bkui-vue/popover2/plugin-popover';
  let popInstance = null;
  const handlePopMsgBtn = (e) => {
    popInstance = $bkPopover({
      target: e,
      content: 'create mode 100644 packages/icon/icons/left-turn-line.tsx',
    });
  };

  const handleShowPop = () => {
    popInstance?.show();
  };

  const handleHidePop = () => {
    popInstance?.close();
  };

  const handleMouseMove = (e) => {
    popInstance?.update(e);
  };
</script>
