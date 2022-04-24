<template>
  <div>
    <bk-input
      :model-value="val"
      clearable
      show-clear-only-hover
      @change="handleChange"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const val = ref('');
  function handleChange(newVal, event) {
    console.log(newVal, event);
    val.value = newVal;
  }
</script>
