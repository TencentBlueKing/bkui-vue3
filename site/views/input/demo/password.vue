<template>
  <div>
    <bk-input
      v-model="val"
      type="password"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const val = ref('');
</script>
