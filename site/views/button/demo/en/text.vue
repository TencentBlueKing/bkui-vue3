<template>
  <div class="basic-button-list">
    <bk-button
      text
      theme="primary"
    >
      Text Button
    </bk-button>
    <bk-button
      text
      theme="primary"
      disabled
      class="ml10"
      loading
    >
      Loading
    </bk-button>
    <bk-button
      text
      class="ml10"
      disabled
    >
      Disabled Button
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
