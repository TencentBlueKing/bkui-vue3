<template>
  <bk-radio-group
    v-model="radioGroupValue"
    type="capsule"
  >
    <bk-radio-button label="QQ" />
    <bk-radio-button label="原始数据" />
    <bk-radio-button label="字典翻译" />
    <bk-radio-button label="微信" />
    <bk-radio-button label="Email" />
  </bk-radio-group>
</template>
<script setup>
  import { ref } from 'vue';

  const radioGroupValue = ref('微信');

</script>

