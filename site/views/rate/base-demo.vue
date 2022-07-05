<template>
  <bk-rate
    v-model:modelValue="disableRate"
    :editable="false"
  />
</template>

<script setup>
  const disableRate = 3.4;
</script>
