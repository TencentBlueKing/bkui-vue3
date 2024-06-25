<template>
  <div>
    <bk-button
      theme="primary"
      text
      @click="handleOpen"
    >
      打开侧栏
    </bk-button>

    <bk-sideslider
      v-model:isShow="isShow"
      title="我是标题"
      renderDirective="if"
    >
      hello world!!!
    </bk-sideslider>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';

  const isShow = ref(false);

  const handleOpen = () => {
    isShow.value = true;
  };
</script>
