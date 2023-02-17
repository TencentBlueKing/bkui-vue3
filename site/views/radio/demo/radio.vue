<template>
  <bk-radio
    v-model="value"
    label="QQ"
  />
  <bk-radio
    v-model="value"
    :label="t('微信')"
  />
  <bk-radio
    v-model="value"
    label="Email"
  />
  <div style="margin-top: 10px">
    {{ t("选中") }}：{{ value }}
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { BkRadio } from '@bkui-vue/radio';
  export default defineComponent({
    setup() {
      const { t } = useI18n();

      const value = ref(t('微信'));

      return {
        t,
        value,
        BkRadio,
      };
    },
  });
</script>
