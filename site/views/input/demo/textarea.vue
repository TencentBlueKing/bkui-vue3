<template>
  <div>
    <bk-input
      v-model="val"
      type="textarea"
      :maxlength="255"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const val = ref('');
</script>
