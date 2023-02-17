<template>
  <bk-checkbox
    :label="t('微信')"
    indeterminate
    checked
  />
</template>
<script>
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { BkCheckbox } from '@bkui-vue/checkbox';;
  export default defineComponent({
    setup() {
      const { t } = useI18n();

      return {
        t,
        BkCheckbox,
      };
    },
  });

</script>


