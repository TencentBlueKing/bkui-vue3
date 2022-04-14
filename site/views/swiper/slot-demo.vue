<script setup>
const list = ['text1', 'text2', 'text3', 'text4', 'text5', 'text6'];
</script>

<template>
  <bk-swiper
    class="swiper"
    :list="list"
    :is-loop="false"
    :height="200"
  >
    <template #default="item">
      <div style="text-align: center;">
        {{ item }}
      </div>
    </template>
  </bk-swiper>
</template>
