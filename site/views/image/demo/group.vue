<template>
  <bk-image-preview-group :show-info="true">
    <div class="image-demo-row">
      <bk-image
        v-for="(item, index) in images"
        :height="120"
        :key="index"
        :preview-props="{ resolution: '1920 × 1080' }"
        :src="item"
        :width="120"
      />
    </div>
  </bk-image-preview-group>
</template>

<script setup>
  const images = [
    '/pexels-allen-boguslavsky.jpg',
    '/pexels-cafer-sevi-nc.jpg',
    '/pexels-charles-delos-reyes.jpg',
  ];
</script>

<style scoped>
  .image-demo-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
</style>
