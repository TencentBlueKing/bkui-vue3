<template>
  <bk-date-picker
    v-model="dateValue"
    :header-slot-cls="'custom-header-wrapper'"
  >
    <template #header>
      <div class="custom-header">
        我是自定义 header
      </div>
    </template>
  </bk-date-picker>
</template>

<script setup>
  import { ref } from 'vue';

  const dateValue = ref(''); // new Date();
</script>

<style lang="postcss">
.custom-header-wrapper {
  color: green;
}

.custom-header {
  text-align: center;
}
</style>
