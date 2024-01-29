<template>
  <bk-checkbox
    v-model="value"
  >
    微信
  </bk-checkbox>
  <div style="margin-top: 10px">
    选中微信：{{ value }}
  </div>
</template>
<script setup>
  import { ref } from 'vue';

  import { BkCheckbox } from '@bkui-vue/checkbox';
  ;

  const value = ref(true);

</script>

