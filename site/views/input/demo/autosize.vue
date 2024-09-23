<template>
  <div>
    <bk-input
      class="mb8"
      v-model="val"
      :maxlength="255"
      :over-max-length-limit="overMaxLengthLimit"
      type="textarea"
      autosize
      :resize="false"
    />
    <bk-input
      class="mb8"
      v-model="val1"
      :autosize="autoSizeConf"
      type="textarea"
      :resize="false"
    />
    <div class="expandable-input-field mb8">
      <bk-input
        class="hover-expand-textarea"
        v-model="val2"
        :resize="false"
        type="textarea"
        autosize
      />
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const val = ref('');
  const val1 = ref('');
  const val2 = ref('');
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
  .mb8 {
    margin-bottom: 8px;
  }
  .expandable-input-field {
    position: relative;
    height: 32px;
  }
  .hover-expand-textarea {
    position: absolute;
    transition: all 0.6s ease;
    height: 32px;
    min-height: 32px;
    &.is-focused,
    &:hover {
      height: auto;
      max-height: 120px;
    }
  }
</style>
