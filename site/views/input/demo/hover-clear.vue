<template>
  <div>
    <bk-input
      v-model="val"
      clearable
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const val = ref('');
</script>
