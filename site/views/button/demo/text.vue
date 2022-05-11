<template>
  <div class="basic-button-list">
    <bk-button
      text
      theme="primary"
    >
      文字按钮
    </bk-button>
    <bk-button
      text
      theme="primary"
      disabled
      class="ml10"
      loading
      loading-mode="spin"
    >
      加载中
    </bk-button>
    <bk-button
      text
      class="ml10"
      disabled
    >
      禁用状态
    </bk-button>
  </div>
</template>

<script setup>
  // import Loading from '@bkui-vue/loading';
</script>

<style lang="postcss">
  .ml10 {
    margin-left: 10px;
  }
</style>
