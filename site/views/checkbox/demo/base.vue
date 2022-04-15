<template>
  <div>
    <BkCheckbox
      model-value="选项一"
      label="选项一"
      disabled
    />
    <BkCheckbox
      label="选项二"
      disabled
    />
    <BkCheckbox
      label="选项三"
      checked
    />
    <BkCheckbox label="选项四" />
  </div>
</template>
<script setup>
import { BkCheckbox } from '@bkui-vue/checkbox';

</script>

