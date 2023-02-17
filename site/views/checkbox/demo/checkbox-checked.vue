<template>
  <bk-checkbox-group v-model="checkboxGroupValue">
    <bk-checkbox
      :label="t('微信')"
      checked
    />
    <bk-checkbox label="QQ" />
    <bk-checkbox label="Email" />
  </bk-checkbox-group>
  <div style="margin-top: 10px">
    {{ t("选中") }}：{{ checkboxGroupValue.join('，') }}
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { BkCheckbox } from '@bkui-vue/checkbox';

  export default defineComponent({
    setup() {
      const { t } = useI18n();

      const checkboxGroupValue = ref([t('微信')]);

      return {
        t,
        checkboxGroupValue,
        BkCheckbox,
      };
    },
  });
</script>
