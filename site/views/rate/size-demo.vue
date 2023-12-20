<template>
  <p
    v-for="(size, index) in sizeArr"
    :key="index"
  >
    {{ size }}:
    <bk-rate
      v-model="rateValue"
      :size="size"
    />
  </p>
</template>

<script setup>
  import { ref } from 'vue';

  const rateValue = ref(3);
  const sizeArr = ref(['small', 'default', 'large', 'huge']);
</script>
