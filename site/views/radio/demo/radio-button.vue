<template>
  <bk-radio-group
    v-model="radioGroupValue"
  >
    <bk-radio-button
      label="QQ"
      disabled
    />
    <bk-radio-button label="微信" />
    <bk-radio-button
      label="Email"
      disabled
    />
  </bk-radio-group>
</template>
<script setup>
  import { ref } from 'vue';

  const radioGroupValue = ref('微信');

</script>

