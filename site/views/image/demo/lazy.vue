<template>
  <div class="image-demo-scroll">
    <bk-image
      v-for="(item, index) in images"
      class="image-demo-lazy"
      :height="120"
      :key="index"
      :src="item"
      :width="200"
      lazy
    />
  </div>
</template>

<script setup>
  const sources = [
    '/pexels-allen-boguslavsky.jpg',
    '/pexels-cafer-sevi-nc.jpg',
    '/pexels-charles-delos-reyes.jpg',
    '/pexels-dumitru-b.jpg',
    '/pexels-eyyup-erten.jpg',
    '/pexels-jomin-thach.jpg',
    '/pexels-lucianasena.jpg',
    '/pexels-pixabay.jpg',
    '/pexels-thatguycraig000.jpg',
    '/pexels-vanessa-g.jpg',
    '/istockphoto.jpg',
  ];
  const images = Array.from({ length: 12 }, (_, index) => sources[index % sources.length]);
</script>

<style scoped>
  .image-demo-scroll {
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 320px;
    overflow: auto;
    padding: 12px;
    background: #f5f7fa;
  }

  .image-demo-lazy {
    flex-shrink: 0;
  }
</style>
