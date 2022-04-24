<template>
  <div>
    <bk-input
      v-model="val"
      class="mb10"
      autocomplete="true"
      autofocus="true"
    />
    <bk-input
      v-model="val"
      class="mb10"
      type="password"
      autocomplete="false"
      autofocus="true"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const val = ref('');
</script>
