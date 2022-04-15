<template>
  <BkAlert
    theme="success"
    title="成功的提示文字"
    closable
    close-text="继续努力"
  />
  <BkAlert
    theme="info"
    title="消息的提示文字"
    closable
    close-text="下次见！"
  />
  <BkAlert
    theme="warning"
    title="警告的提示文字"
    closable
    close-text="删掉"
  />
</template>
<script setup>
import BkAlert from '@bkui-vue/alert';

</script>
<style lang="postcss">
  .bk-alert ~ .bk-alert{
      margin-top: 20px;
  }
</style>
