<template>
  <div>
    <bk-input class="mb8" v-model="val" :max="100" :min="1" step="0.5" :precision="1" size="small" type="number"
      clearable />
    <bk-input class="mb8" v-model="val1" :max="100" :min="1" type="number" clearable />
    <bk-input class="mb8" v-model="val2" :max="100" :min="1" size="large" type="number" clearable disabled />
  </div>
</template>

<script setup>
import { ref } from 'vue';
const val = ref();
const val1 = ref(1);
const val2 = ref(1);

</script>

<style lang="less">
.mb10 {
  margin-bottom: 10px;
}

.mb8 {
  margin-bottom: 8px;
}
</style>
