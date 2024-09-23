<template>
  <Button theme="primary" @click="showSlotReleaseNote = true">
    查看版本日志
  </Button>
  <ReleaseNote v-model:show="showSlotReleaseNote">
    <template #list>
      <div>左侧版本列表区域</div>
    </template>
    <template #detail>
      <div>右侧日志详情区域</div>
    </template>
  </ReleaseNote>
</template>
<script setup>
  import { ref } from 'vue';
  import { Button } from 'bkui-vue';
  import ReleaseNote from '@blueking/release-note';
  import '@blueking/release-note/vue3/vue3.css';

  const showSlotReleaseNote = ref(false);
</script>
