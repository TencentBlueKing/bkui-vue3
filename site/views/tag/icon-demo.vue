<template>
  <div>
    <bk-tag>
      <template #icon>
        <Bk />
      </template>
      蓝鲸
    </bk-tag>
    <bk-tag>
      <template #icon>
        <Weixin />
      </template>
      微信
    </bk-tag>
    <bk-tag>
      <template #icon>
        <QQ />
      </template>
      QQ
    </bk-tag>
  </div>
</template>

<script setup>
import { QQ, Weixin, Bk } from '@bkui-vue/icon';
</script>
