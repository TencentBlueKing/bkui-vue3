<template>
  <div>
    <bk-input
      v-model="val"
      class="mb10"
      disabled
    />
    <bk-input
      class="mb10"
      readonly
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const val = ref('hello world');
</script>
