<template>
  <bk-image
    :height="120"
    :preview-props="previewProps"
    :show-info="true"
    :src="src"
    :width="160"
  />
</template>

<script setup>
  const src = '/pexels-dumitru-b.jpg';
  const previewProps = {
    name: 'pexels-dumitru-b.jpg',
    width: 1920,
    resolution: '1920 × 1080',
  };
</script>
