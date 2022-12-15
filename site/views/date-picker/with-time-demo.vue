<template>
  <bk-date-picker
    v-model="dateValue"
    clearable
    :disable-date="disableDate"
    type="datetime"
    @change="handleChange"
    @clear="handleClear"
    @pick-success="handleOk"
    @open-change="handleOpenChange"
  >
    <template #footer>
      <div class="custom-footer">
        我是自定义 footer
      </div>
    </template>
    <!-- <template #confirm>
      <div class="custom-footer">
        我是自定义 confirm
      </div>
    </template> -->
  </bk-date-picker>
</template>

<script setup>
  import { ref } from 'vue';
  const dateValue = ref(new Date());
  const disableDate = date => date && date.valueOf() < Date.now() - 86400;

  const handleChange = (date) => {
    console.log('handleChange', date);
    dateValue.value = date;
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
