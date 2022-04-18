<template>
  <div>
    <bk-checkbox
      model-value="选项一"
      label="选项一"
      disabled
    />
    <bk-checkbox
      label="选项二"
      disabled
    />
    <bk-checkbox
      label="选项三"
      checked
    />
    <bk-checkbox label="选项四" />
  </div>
</template>
<script setup>
  import { BkCheckbox } from '@bkui-vue/checkbox';

</script>

