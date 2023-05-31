<template>
  <div>
    <p style="font-size: 14px;">
      年选择器 {{ yearValue }}
    </p>
    <bk-date-picker
      v-model="initDateTime"
      type="year"
      @change="handleYearChange"
    />
  </div>
  <div>
    <p style="font-size: 14px;">
      月选择器 {{ monthValue }}
    </p>
    <bk-date-picker
      v-model="initDateTime"
      type="month"
      @change="handleMonthChange"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const initDateTime = ref(new Date());
  const yearValue = ref('');
  const handleYearChange = (val) => {
    console.warn('handleChange', val);
    yearValue.value = val;
  };
  const monthValue = ref('');
  const handleMonthChange = (val) => {
    console.warn('handleChange', val);
    monthValue.value = val;
  };
</script>
