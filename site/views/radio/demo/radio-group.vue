<template>
  <bk-radio-group v-model="radioGroupValue">
    <bk-radio label="QQ" />
    <bk-radio :label="t('微信')" />
    <bk-radio label="Email" />
  </bk-radio-group>
  <div style="margin-top: 10px">
    {{ t("选中") }}：{{ radioGroupValue }}
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { BkRadio } from '@bkui-vue/radio';
  export default defineComponent({
    setup() {
      const { t } = useI18n();

      const radioGroupValue = ref(t('微信'));

      return {
        t,
        radioGroupValue,
        BkRadio,
      };
    },
  });
</script>
