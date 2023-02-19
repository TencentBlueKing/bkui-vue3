<template>
  <div class="basic-button-list">
    <bk-button>
      基础按钮
    </bk-button>
    <bk-button
      theme="primary"
      class="ml10"
    >
      主要按钮
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
