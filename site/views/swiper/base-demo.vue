<script setup>
  import firstSwiper from '../../imgs/firstswiper.jpg';
  import secondSwiper from '../../imgs/secondswiper.jpg';

  const picList = [
    { url: firstSwiper, link: 'https://www.npmjs.com/package/bkui-vue' },
    { url: secondSwiper },
    { url: firstSwiper, link: 'https://www.npmjs.com/package/bkui-vue' },
    { url: secondSwiper },
    { url: firstSwiper, link: 'https://www.npmjs.com/package/bkui-vue' },
    { url: secondSwiper },
    { url: firstSwiper, link: 'https://www.npmjs.com/package/bkui-vue' },
    { url: secondSwiper },
  ];
</script>

<template>
  <bk-swiper
    class="swiper"
    :pics="picList"
    :loop-time="6000"
    :height="400"
  />
</template>
