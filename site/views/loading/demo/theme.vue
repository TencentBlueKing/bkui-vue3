<template>
  <div>
    <bk-radio-group
      v-model="theme"
    >
      <bk-radio label="primary" />
      <bk-radio label="danger" />
      <bk-radio label="warning" />
      <bk-radio label="white" />
      <bk-radio label="">
        normal
      </bk-radio>
      <bk-radio label="default" />
    </bk-radio-group>
    <bk-loading
      loading
      :theme="theme"
    >
      <div :style="`width: 100%; height: 360px; background: ${theme === 'white' ? 'gray' : 'white'};`" />
    </bk-loading>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const theme = ref('');
</script>

<style lang="postcss">
  .mb10 {
    margin-bottom: 10px;
  }
</style>
