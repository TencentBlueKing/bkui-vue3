<template>
  <div>
    <bk-input
      v-model="val"
      clearable
      type="search"
      :maxlength="88"
      show-word-limit
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const val = ref('');
</script>
