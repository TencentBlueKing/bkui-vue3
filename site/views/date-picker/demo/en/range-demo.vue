<template>
  <bk-date-picker
    ref="datePickerRef"
    append-to-body
    clearable
    :model-value="defaultValue"
    style="width: 100%"
    type="datetimerange"
    @change="handleChange"
  >
    <template #footer>
      <div class="custom-footer">
        I am a custom footer
      </div>
    </template>
    <template #confirm>
      <div class="custom-footer">
        I am custom confirm
        <a
          href="javascript:void(0)"
          @click="aaa"
        > Switch date and time</a>
      </div>
    </template>
  </bk-date-picker>
</template>

<script>
  import { defineComponent, reactive, ref } from 'vue';

  export default defineComponent({
    setup() {
      const datePickerRef = ref(null);
      const defaultValue = reactive([new Date(), new Date()]);
      const handleChange = (date) => {
        defaultValue.value = date;
        console.error(datePickerRef);
      // datePickerRef.value.pickerPanelRef.handleToggleTime();
      };
      const aaa = () => {
        // datePickerRef.value.pickerPanelRef.handleToggleTime();
        datePickerRef.value.handleToggleTime();
      };

      return {
        datePickerRef,
        defaultValue,
        aaa,
        handleChange,
      };
    },
  });
</script>
