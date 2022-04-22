<template>
  <bk-radio
    v-model="value"
    label="QQ"
  />
  <bk-radio
    v-model="value"
    label="微信"
  />
  <bk-radio
    v-model="value"
    label="Email"
  />
  <div style="margin-top: 10px;">
    选中：{{ value }}
  </div>
</template>
<script setup>
  import { ref } from 'vue';

  import { BkRadio } from '@bkui-vue/radio';

  const value = ref('微信');
</script>
