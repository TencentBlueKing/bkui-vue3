<template>
  <BkCheckboxGroup v-model="checkboxGroupValue">
    <BkCheckbox
      label="选项一"
      disabled
      false-label="{false}"
    />
    <BkCheckbox
      label="选项二"
      disabled
      false-label="{false}"
    />
    <BkCheckbox label="选项三" />
    <BkCheckbox label="选项四" />
    <BkCheckbox label="选项五" />
  </BkCheckboxGroup>
</template>
<script setup>
import { ref } from 'vue';

import { BkCheckbox, BkCheckboxGroup } from '@bkui-vue/checkbox';

const checkboxGroupValue = ref(['选项一']);

</script>
<style lang="postcss">
</style>
