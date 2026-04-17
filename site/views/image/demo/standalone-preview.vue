<template>
  <div>
    <bk-button
      theme="primary"
      @click="visible = true"
    >
      打开预览
    </bk-button>
    <bk-image-preview
      v-model="visible"
      v-model:current="current"
      :images="images"
      :show-info="true"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const visible = ref(false);
  const current = ref(0);
  const images = [
    {
      url: '/pexels-eyyup-erten.jpg',
      name: 'pexels-eyyup-erten.jpg',
      width: 1920,
      resolution: '1920 × 1080',
    },
    {
      url: '/pexels-jomin-thach.jpg',
      name: 'pexels-jomin-thach.jpg',
    },
  ];
</script>
