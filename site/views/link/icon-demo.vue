<template>
  <div>
    <bk-link
      theme="primary"
    >
      <div style="display: inline-block; vertical-align: middle;">
        <bk-help />
      </div>
      文本链接
    </bk-link>

    <bk-link
      theme="primary"
      style="display: block"
    >
      文本链接
      <div style="display: inline-block; vertical-align: text-bottom; font-size: 12px;">
        <bk-share />
      </div>
    </bk-link>
  </div>
</template>
<script setup>
  import { Help as BkHelp, Share as BkShare } from '@bkui-vue/icon';
</script>
