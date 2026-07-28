<template>
  <div class="image-demo-row">
    <div
      v-for="item in fits"
      class="image-demo-fit"
      :key="item"
    >
      <bk-image
        :fit="item"
        :height="120"
        :src="src"
        :width="120"
      />
      <span>{{ item }}</span>
    </div>
  </div>
</template>

<script setup>
  const src = '/pexels-thatguycraig000.jpg';
  const fits = ['fill', 'contain', 'cover', 'none', 'scale-down'];
</script>

<style scoped>
  .image-demo-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  .image-demo-fit {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    font-size: 12px;
    color: #63656e;
  }
</style>
