<template>
  <bk-time-picker
    :model-value="defaultValue"
    :placeholder="'选择时间范围'"
    :type="'timerange'"
    format="HH:mm"
    allow-cross-day
    @change="handleChange"
  />
</template>

<script setup>
  import { ref } from 'vue';
  const defaultValue = ref(['00:00:00', '23:59:59']);
  const handleChange = payload => {
    defaultValue.value = [...payload];
  };
</script>
