<template>
  <div>
    <bk-button
      theme="primary"
      text
      @click="handleShow"
    >
      打开 dialog
    </bk-button>
    <bk-dialog
      v-model:is-show="isShow"
      title="描述"
      quick-close
    >
      <div>hello world!</div>
    </bk-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isShow = ref(false);

const handleShow = () => {
  isShow.value = true;
};
</script>
