<template>
  <date-picker
    v-model="value"
    v-model:timezone="timezone"
  />
</template>
<script setup lang="ts">
  import { ref } from 'vue';

  import DatePicker from '@blueking/date-picker';

  import '@blueking/date-picker/dist/vue3-light.css';
  const value = ref(['now/d', 'now/d']);
  const timezone = ref('America/New_York');
</script>
