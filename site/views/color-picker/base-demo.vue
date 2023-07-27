<template>
  <div>
    <bk-color-picker
      v-model="color1"
      class="color-picker"
      @change="change"
    />
    <bk-color-picker
      v-model="color1"
      :show-value="false"
    />
  </div>
</template>
<script setup>
  import { ref } from 'vue';

  import BkColorPicker from '@bkui-vue/color-picker';
  const color1 = ref('');
  const change = (v) => {
    console.log(v);
  };
</script>

<style lang="postcss" scoped>
.color-picker {
  margin-right: 20px;
}
</style>
