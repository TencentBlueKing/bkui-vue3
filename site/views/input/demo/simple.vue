<template>
  <div>
    <bk-input
      v-model="val"
      behavior="simplicity"
    />
  </div>
</template>


<script setup>
  import { ref } from 'vue';
  const val = ref('');
</script>
