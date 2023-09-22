<template>
  <div>
    <bk-input
      v-model="val"
      class="mb10"
      autosize
      type="textarea"
      :over-max-length-limit="overMaxLengthLimit"
      :maxlength="255"
    />
    <bk-input
      v-model="val1"
      :autosize="autoSizeConf"
      type="textarea"
      :over-max-length-limit="overMaxLengthLimit"
      :maxlength="255"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const val = ref('');
  const val1 = ref('');
  const autoSizeConf = {
    minRows: 2,
    maxRows: 6,
  };
  const overMaxLengthLimit = ref(false);
</script>

<style lang="less">
  .mb10 {
    margin-bottom: 10px;
  }
</style>
