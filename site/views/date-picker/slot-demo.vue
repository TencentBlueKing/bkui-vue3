<template>
  <bk-date-picker
    v-model="dateValue"
    :open="open"
    @change="handleChange"
    @clear="handleClear"
    @pick-success="handleOk"
    @open-change="handleOpenChange"
  >
    <template #trigger>
      <a
        href="javascript:void(0)"
        @click="handleClick"
      >
        <template v-if="dateValue === ''">
          Select date
        </template>
        <template v-else>
          {{ dateValue }}
        </template>
      </a>
    </template>
  </bk-date-picker>
</template>

<script setup>
  import { ref } from 'vue';

  const dateValue = ''; // new Date();
  const open = ref(false);
  const handleChange = (date) => {
    console.log('handleChange', date);
    // this.value = date
  };
  const handleClick = () => {
    console.error('handleClick');
    open.value = !open.value;
  };
  const handleOpenChange = (isOpen) => {
    console.error('handleOpenChange');
    console.log(isOpen);
  };
  const handleClear = () => {
    console.log('handleClear');
    open.value = false;
  };
  const handleOk = () => {
    console.log('handleOK');
    open.value = false;
  };
</script>
