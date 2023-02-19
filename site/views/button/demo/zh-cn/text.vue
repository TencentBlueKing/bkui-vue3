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

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'Text',
  });
</script>

<style lang="postcss">
  .ml10 {
    margin-left: 10px;
  }
</style>
