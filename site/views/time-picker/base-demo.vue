<template>
  <bk-time-picker
    v-model="dateValue"
    format="HH:mm"
    clearable
  />
</template>

<script setup>
  import { ref } from 'vue';
  const dateValue = ref('12:12:12');
</script>
