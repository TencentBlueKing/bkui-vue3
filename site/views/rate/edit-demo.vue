<template>
  <bk-rate
    v-model="rateValue"
    @change="handleRateChange"
  />
</template>

<script setup>
  import { ref } from 'vue';

  const rateValue = ref(3);

  const handleRateChange = (rate) => {
    alert(rate);
  };
</script>
