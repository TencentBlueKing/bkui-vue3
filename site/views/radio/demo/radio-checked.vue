<template>
  <bk-radio label="QQ" />
  <bk-radio
    :label="t('微信')"
    checked
  />
  <bk-radio label="Email" />
</template>
<script>
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { BkRadio } from '@bkui-vue/radio';
  export default defineComponent({
    setup() {
      const { t } = useI18n();

      return {
        t,
        BkRadio,
      };
    },
  });
</script>
