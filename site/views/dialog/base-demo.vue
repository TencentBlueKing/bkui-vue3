<template>
  <div>
    <bk-button
      theme="primary"
      text
      @click="handleShow"
    >
      打开 dialog1
    </bk-button>
    <bk-dialog
      v-model:is-show="isShow"
      :draggable="true"
      :show-mask="false"
      title="描述1"
      quick-close
    >
      <div>hello world - 111!</div>
    </bk-dialog>

    <bk-button
      theme="primary"
      text
      @click="handleShow2"
    >
      打开 dialog2
    </bk-button>
    <bk-dialog
      v-model:is-show="isShow2"
      :draggable="true"
      :show-mask="false"
      title="描述2"
      quick-close
    >
      <div>hello world - 111!</div>
    </bk-dialog>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const isShow = ref(false);
  const isShow2 = ref(false);

  const handleShow = () => {
    isShow.value = true;
  };

  const handleShow2 = () => {
    isShow2.value = true;
  };
</script>
