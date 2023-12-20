<template>
  <div>
    <bk-input
      v-model="val"
      class="mb8"
      disabled
    />
    <bk-input
      class="mb8"
      readonly
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const val = ref('hello world');
</script>
<style lang="postcss" scoped>
.mb8 {
  margin-bottom: 8px;
}
</style>
