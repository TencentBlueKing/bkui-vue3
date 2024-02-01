<template>
  <bk-checkbox
    label="weixin"
    :before-change="beforeWeixinChange"
  >
    微信
  </bk-checkbox>
  <bk-checkbox
    label="qq"
    :before-change="beforeQQChange"
  >
    QQ
  </bk-checkbox>
</template>
<script setup>
  import { BkCheckbox } from '@bkui-vue/checkbox';

  const beforeWeixinChange = () => new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 3000);
  });

  const beforeQQChange = () => false;

</script>

