<template>
  <bk-radio-group
    v-model="radioGroupValue"
  >
    <template v-if="show">
      <bk-radio-button label="QQ" />
      <bk-radio-button label="微信" />
      <bk-radio-button label="Email" />
    </template>
  </bk-radio-group>
</template>
<script setup>
  import { ref } from 'vue';

  const radioGroupValue = ref('微信');

  const show = ref(false);

  setTimeout(() => {
    show.value = true;
  }, 3000);
</script>

