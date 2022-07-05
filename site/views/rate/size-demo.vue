<template>
  <bk-rate
    v-model="rateValue"
    size="large"
  />
</template>

<script setup>
  import { ref } from 'vue';

  const rateValue = ref(3);
</script>
