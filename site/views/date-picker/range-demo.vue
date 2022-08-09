<template>
  <!-- <bk-date-picker
    class="mr15"
    :placeholder="'选择日期范围'"
    :type="'daterange'"
  /> -->
  <bk-date-picker
    append-to-body
    :clearable="false"
    :model-value="defaultValue"
    style="width: 100%;"
    type="datetimerange"
    @change="handleChange"
  />
</template>

<script setup>
  import { reactive } from 'vue';
  const defaultValue = reactive([new Date(), new Date()]);
  const handleChange = (date) => {
    console.log('handleChange', date);
    defaultValue.value = date;
  };
</script>
