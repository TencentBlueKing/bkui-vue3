<template>
  <bk-resize-layout
    style="height: 500px;"
    immediate
    :min="50"
    :max="400"
  >
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
</script>

