<template>
  <div class="disabled-button-list">
    <bk-button
      disabled
      class="ml10"
    >
      基础按钮
    </bk-button>
    <bk-button
      disabled
      theme="primary"
      class="ml10"
    >
      主要按钮
    </bk-button>
  </div>
</template>

<script lang="ts">
  import  { defineComponent } from 'vue';

  export default defineComponent({
    name: 'Disabled',
  });
</script>

