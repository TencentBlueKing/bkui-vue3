<template>
  <bk-resize-layout style="height: 500px" collapsible :isCollapsed="isCollapsed">
    <template #aside>
      <div>aside</div>
    </template>
    <template #main>
      <div>main</div>
    </template>
  </bk-resize-layout>
</template>
<script setup>
import BkResizeLayout from '@bkui-vue/resize-layout';
import { ref } from 'vue';

const isCollapsed = ref(true);
</script>
