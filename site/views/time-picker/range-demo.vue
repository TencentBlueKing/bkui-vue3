<template>
  <bk-time-picker
    :model-value="defaultValue"
    :placeholder="'选择时间范围'"
    :type="'timerange'"
    format="HH:mm"
    allow-cross-day
  />
</template>

<script setup>
  import { reactive } from 'vue';
  const defaultValue = reactive(['00:00:00', '23:59:59']);
</script>
