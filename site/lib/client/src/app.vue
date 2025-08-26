<template>
  <magicbox-header
    avatar-host="https://q1.qlogo.cn"
    design-url="https://bkdesign.bk.tencent.com/"
    less-code-url="https://github.com/TencentBlueKing/bk-lesscode/blob/master/readme.md"
    login-url="https://login.bk.tencent.com"
    region="tencent"
    root-domain="tencent.com"
  />
  <router-view />
</template>

<script lang="ts" setup>
import MagicboxHeader from '@blueking/magicbox-header/index.vue';
</script>
