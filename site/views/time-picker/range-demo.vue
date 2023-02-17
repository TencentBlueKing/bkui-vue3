<template>
  <bk-time-picker
    :model-value="defaultValue"
    :placeholder="t('选择时间范围')"
    :type="'timerange'"
  />
</template>

<script>
  import { defineComponent, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';;
  export default defineComponent({
    setup() {
      const defaultValue = reactive(['00:00:00', '23:59:59']);
      const { t } = useI18n();
      return {
        defaultValue,
        t,
      };
    },
  });

</script>
