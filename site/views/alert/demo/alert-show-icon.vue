<template>
  <BkAlert
    theme="success"
    title="成功的提示文字"
    :show-icon="false"
  />
  <BkAlert
    theme="info"
    title="消息的提示文字"
    :show-icon="false"
  />
  <BkAlert
    theme="warning"
    title="警告的提示文字"
    :show-icon="false"
  />
  <BkAlert
    theme="error"
    title="错误的提示文字"
    :show-icon="false"
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
