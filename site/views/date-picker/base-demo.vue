<template>
  {{ dateValue }}
  <bk-date-picker
    v-model="dateValue"
    :disabled-date="disabledDate"
    append-to-body
    clearable
    @change="handleChange"
  />
</template>

<script setup>
import { ref } from 'vue';
const dateValue = ref(new Date());
const disabledDate = (date) => date.valueOf() < Date.now() - 86400000 * 2;
const handleChange = (date) => {
  console.error('dateValue.value', dateValue.value);
};
</script>
