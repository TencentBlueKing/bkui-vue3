<template>
  <bk-checkbox v-model="value">
    {{ t('微信') }}
  </bk-checkbox>
  <div style="margin-top: 10px">
    {{ `${t('选中微信')}：` }}{{ value }}
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { BkCheckbox } from '@bkui-vue/checkbox';;
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const value = ref(true);
      return {
        t,
        value,
        BkCheckbox,
      };
    },
  });

</script>


