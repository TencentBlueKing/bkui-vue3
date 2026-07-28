<template>
  <div class="image-demo-row">
    <bk-image
      :height="120"
      :src="src"
      :width="160"
      alt="示例图片"
    />
  </div>
</template>

<script setup>
  const src = '/pexels-allen-boguslavsky.jpg';
</script>

<style scoped>
  .image-demo-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
</style>
