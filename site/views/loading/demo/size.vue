<template>
  <div>
    <bk-radio-group
      v-model="size"
    >
      <bk-radio label="mini" />
      <bk-radio label="small" />
      <bk-radio label="">
        normal
      </bk-radio>
      <bk-radio label="large" />
    </bk-radio-group>
    <bk-loading
      loading
      :size="size"
    >
      <div style="width: 100%; height: 360px" />
    </bk-loading>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const size = ref('small');
</script>

<style lang="postcss">
  .mb10 {
    margin-bottom: 10px;
  }
</style>
