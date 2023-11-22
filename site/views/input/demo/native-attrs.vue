<template>
  <div>
    <bk-input
      v-model="val"
      class="mb10"
      autocomplete="true"
      autofocus
    />
    <bk-input
      v-model="val"
      class="mb10"
      type="password"
      autocomplete="false"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const val = ref('');
</script>
