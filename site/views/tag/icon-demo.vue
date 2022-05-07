<template>
  <div>
    <bk-tag>
      <template #icon>
        <bk />
      </template>
      蓝鲸
    </bk-tag>
    <bk-tag>
      <template #icon>
        <weixin />
      </template>
      微信
    </bk-tag>
    <bk-tag>
      <template #icon>
        <qq />
      </template>
      QQ
    </bk-tag>
  </div>
</template>

<script setup>
  import { Bk, Qq, Weixin } from '@bkui-vue/icon';
</script>
