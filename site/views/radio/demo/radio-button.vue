<template>
  <BkRadioGroup
    v-model="radioGroupValue"
  >
    <BkRadioButton label="QQ" />
    <BkRadioButton label="微信" />
    <BkRadioButton label="Email" />
  </BkRadioGroup>
</template>
<script setup>
import { ref } from 'vue';

const radioGroupValue = ref('微信');
</script>
<style lang="postcss">
</style>
