<template>
  <bk-date-picker
    v-model="dateValue"
    clearable
  />
</template>

<script setup>
  import { ref } from 'vue';
  const dateValue = ref(new Date());
</script>
