<template>
  <bk-date-picker
    v-model="dateValue"
    clearable
    append-to-body
    :disabled-date="disabledDate"
  />
</template>

<script setup>
  import { ref } from 'vue';
  const dateValue = ref(new Date());
  const disabledDate = date => date && date.valueOf() < Date.now() - 86400;
</script>
