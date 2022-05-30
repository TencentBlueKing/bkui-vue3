<template>
  <div>
    <bk-input
      v-model="val"
      type="number"
      :min="1"
      :max="100"
      clearable
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const val = ref(1);
</script>
