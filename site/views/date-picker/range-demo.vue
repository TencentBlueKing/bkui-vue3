<template>
  <!-- <bk-date-picker
    class="mr15"
    :placeholder="'选择日期范围'"
    :type="'daterange'"
  /> -->
  <bk-date-picker
    ref="datePickerRef"
    style="width: 100%"
    :disabled-date="disabledDate"
    :model-value="defaultValue"
    :time-picker-options="{ allowCrossDay: true }"
    type="datetimerange"
    append-to-body
    clearable
    @change="handleChange"
    @pick-first="handlePickFirst"
  >
    <template #footer>
      <div class="custom-footer">我是自定义 footer</div>
    </template>
    <template #confirm>
      <div class="custom-footer">
        我是自定义 confirm
        <a href="javascript:void(0)" @click="aaa"> 切换日期时间 </a>
      </div>
    </template>
  </bk-date-picker>
</template>

<script setup>
import { reactive, ref } from 'vue';
const datePickerRef = ref(null);
const defaultValue = reactive([new Date(), new Date()]);
const handleChange = (date) => {
  defaultValue.value = date;
  console.error('defaultValue.value', defaultValue.value);
  // datePickerRef.value.pickerPanelRef.handleToggleTime();
};
const aaa = () => {
  // datePickerRef.value.pickerPanelRef.handleToggleTime();
  datePickerRef.value.handleToggleTime();
};

const handlePickFirst = (type, val) => {
  console.error(123, type, val);
};

const disabledDate = (date) => date && date.valueOf() < Date.now() - 86400;
</script>
