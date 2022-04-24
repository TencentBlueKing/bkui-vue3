<template>
  <div>
    <bk-input
      v-model="val"
      clearable
      type="search"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const val = ref('');
</script>
