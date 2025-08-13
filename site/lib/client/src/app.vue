<template>
  <magicbox-header
    avatarHost='https://q1.qlogo.cn'
    designUrl='https://bkdesign.bk.tencent.com/'
    lessCodeUrl='https://github.com/TencentBlueKing/bk-lesscode/blob/master/readme.md'
    loginUrl='https://login.bk.tencent.com'
    region='tencent'
    rootDomain='tencent.com'
  />
  <router-view />
</template>

<script lang="ts" setup>
import MagicboxHeader from '@blueking/magicbox-header/index.vue'
</script>
