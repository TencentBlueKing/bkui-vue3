<template>
  <div class="basic-button-list">
    <bk-button>
      Basic Button
    </bk-button>
    <bk-button
      theme="primary"
      class="ml10"
    >
      Primary Button
    </bk-button>
  </div>
</template>

<script>
  import  { defineComponent } from 'vue';

  export default defineComponent({
    name: 'Basic',
  });
</script>

<style lang="postcss">
  .basic-button-list {
    display: flex;
  }

  .ml10 {
    margin-left: 10px;
  }
</style>
