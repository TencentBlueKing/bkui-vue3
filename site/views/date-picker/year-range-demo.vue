<template>
  <bk-date-picker
    ref="datePickerRef"
    class="mr15"
    :model-value="defaultValue"
    :placeholder="'选择年份范围'"
    :disabled-date="disabledDate"
    type="yearrange"
    @change="handleChange"
    @pick-first="handlePickFirst"
  />
</template>

<script setup>
  import { reactive, ref } from 'vue';
  const datePickerRef = ref(null);
  const defaultValue = reactive([
    new Date(new Date().getFullYear() + 10, new Date().getMonth() + 1),
    new Date(new Date().getFullYear() + 15, new Date().getMonth() + 4),
  ]);
  // const defaultValue = reactive(['2024-01-01', '2024-03-01']);
  const handleChange = (date) => {
    defaultValue.value = date;
    console.error(date);
    console.error(datePickerRef);
    // datePickerRef.value.pickerPanelRef.handleToggleTime();
  };
  const handlePickFirst = (val, type) => {
    console.error(val, type);
  };

  const disabledDate = date => date && date.valueOf() < Date.now() - 86400;
</script>
