<template>
  <bk-animate-number
    :value="numValue"
    :digits="2"
  />
  <bk-button
    @click="handleClick"
  >
    +
  </bk-button>
</template>

<script setup>
  import { ref } from 'vue';

  const numValue = ref(20.75);

  const handleClick = () => {
    numValue.value += 20;
  };
</script>
