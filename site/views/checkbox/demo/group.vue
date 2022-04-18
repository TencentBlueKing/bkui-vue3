<template>
  <bk-checkbox-group v-model="checkboxGroupValue">
    <bk-checkbox
      label="选项一"
      disabled
      false-label="{false}"
    />
    <bk-checkbox
      label="选项二"
      disabled
      false-label="{false}"
    />
    <bk-checkbox label="选项三" />
    <bk-checkbox label="选项四" />
    <bk-checkbox label="选项五" />
  </bk-checkbox-group>
</template>
<script setup>
  import { ref } from 'vue';

  import { BkCheckbox, BkCheckboxGroup } from '@bkui-vue/checkbox';

  const checkboxGroupValue = ref(['选项一']);

</script>
<style lang="postcss">
</style>
