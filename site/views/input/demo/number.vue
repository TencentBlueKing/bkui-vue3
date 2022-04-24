<template>
  <div>
    <bk-input
      v-model="val"
      type="number"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const val = ref(0);
</script>
