<template>
  <bk-date-picker
    v-model="dateValue"
    clearable
    :disable-date="disableDate"
  />
</template>

<script setup>
  import { ref } from 'vue';
  const dateValue = ref(new Date());
  const disableDate = date => date && date.valueOf() < Date.now() - 86400;
</script>
