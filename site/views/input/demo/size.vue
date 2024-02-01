<template>
  <div>
    <bk-input
      v-model="xxxx"
      class="mb8"
      size="small"
    />
    <bk-input
      v-model="prefix"
      size="small"
      class="mb8"
      type="url"
      prefix="https://"
    />
    <bk-input
      v-model="normal"
      class="mb8"
    />
    <bk-input
      v-model="suffix"
      class="mb8"
      type="url"
      suffix="@qq.com"
    />
    <bk-input
      v-model="search"
      size="large"
      class="mb8"
      type="search"
    />
    <bk-input
      v-model="large"
      class="mb8"
      size="large"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const xxxx = ref('');
  const prefix = ref('');
  const normal = ref('');
  const suffix = ref('');
  const search = ref('');
  const large = ref('');
</script>
<style lang="postcss" scoped>
.mb8 {
  margin-bottom: 8px;
}
</style>
