<template>
  <!-- <bk-date-picker
    class="mr15"
    :placeholder="'选择日期范围'"
    :type="'daterange'"
  /> -->
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
        {{ t('我是自定义 footer') }}
      </div>
    </template>
    <template #confirm>
      <div class="custom-footer">
        {{ t('我是自定义 confirm') }}
        <a
          href="javascript:void(0)"
          @click="aaa"
        > {{ t('切换日期时间') }} </a>
      </div>
    </template>
  </bk-date-picker>
</template>

<script>
  import { defineComponent, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();
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
        t,
        datePickerRef,
        defaultValue,
        aaa,
        handleChange,
      };
    },
  });
</script>
