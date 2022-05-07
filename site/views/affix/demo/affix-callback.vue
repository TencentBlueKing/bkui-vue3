<template>
  <bk-affix
    :offset-top="300"
    @change="change"
  >
    <bk-button theme="primary">
      固定在顶部300px，固定状态改变时的回调
    </bk-button>
  </bk-affix>
</template>
<script setup>
  import BkMessage from '@bkui-vue/message';
  const change = (status) => {
    BkMessage({
      message: `当前状态${status}`,
      offsetY: 80,
    });
  };
</script>
