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
      class="mb10"
      :autosize="autoSizeConf"
      type="textarea"
    />
    <div
      class="expandable-input-field mb10"
    >
      <bk-input
        v-model="val2"
        type="textarea"
        class="hover-expand-textarea"
        autosize
        :resize="false"
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
  .expandable-input-field {
    position: relative;
    height: 32px;
  }
  .hover-expand-textarea {
    position: absolute;
    transition: all .6s ease;
    height: 32px;
    min-height: 32px;
    &.is-focused,
    &:hover {
      height: auto;
      max-height: 120px;
    }
  }
</style>
