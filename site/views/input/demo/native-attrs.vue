<template>
  <div>
    <bk-input
      v-model="val"
      class="mb8"
      autocomplete="true"
      autofocus
    />
    <bk-input
      v-model="val"
      class="mb8"
      type="password"
      autocomplete="false"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const val = ref('');
</script>

<style lang="postcss" scoped>
.mb8 {
  margin-bottom: 8px;
}
</style>
