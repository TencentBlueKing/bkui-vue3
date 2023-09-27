<template>
  <div class="input-max-length-demo">
    <bk-input
      v-model="val"
      clearable
      :maxlength="10"
      show-word-limit
    />
    <bk-input
      v-model="val2"
      clearable
      :maxcharacter="10"
      show-word-limit
    />
    <bk-input
      v-model="val3"
      :maxcharacter="22"
      over-max-length-limit
      show-word-limit
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const val = ref('');
  const val2 = ref('');
  const val3 = ref('');
</script>

<style lang="less">
  .input-max-length-demo {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    grid-gap: 12px;
  }
</style>
