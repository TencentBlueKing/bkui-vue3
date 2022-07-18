<template>
  <div>
    <bk-color-picker
      v-model="color2"
      class="color-picker"
      size="large"
    />
    <bk-color-picker
      v-model="color2"
      class="color-picker"
    />
    <bk-color-picker
      v-model="color2"
      size="small"
    />
  </div>
</template>
<script setup>
  import { ref } from 'vue';

  import BkColorPicker from '@bkui-vue/color-picker';
  const color2 = ref('3A84FF');
</script>

<style lang="postcss" scoped>
.color-picker {
  margin-right: 20px;
}
</style>
