<template>
  <div>
    <bk-input
      v-model="val"
      clearable
      show-clear-only-hover
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const val = ref('');
</script>
