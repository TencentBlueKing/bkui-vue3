<template>
  <bk-color-picker
    v-model="color3"
    class="color-picker"
    :recommend="false"
  />
  <bk-color-picker
    v-model="color3"
    :recommend="recommendColors"
  />
</template>

<script setup>
  import { ref } from 'vue';

  import BkColorPicker from '@bkui-vue/color-picker';
  const color3 = ref('3A84FF');
  const recommendColors = ref(['#000', '#333', '#666', '#999', 'FFF']);
</script>

<style lang="postcss" scoped>
.color-picker {
  margin-right: 20px;
}
</style>
