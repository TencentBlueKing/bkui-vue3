<template>
  <div class="disabled-button-list">
    <bk-button
      disabled
      class="ml10"
    >
      Basic Button
    </bk-button>
    <bk-button
      disabled
      theme="primary"
      class="ml10"
    >
      Primary Button
    </bk-button>
  </div>
</template>

<script lang="ts">
  import  { defineComponent } from 'vue';

  export default defineComponent({
    name: 'Disabled',
  });
</script>

