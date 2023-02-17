<template>
  <bk-alert
    theme="success"
    :title="t('成功的提示文字')"
    :close-text="t('继续努力')"
    closable
  />
  <bk-alert
    theme="info"
    :title="t('消息的提示文字')"
    :close-text="t('下次见！')"
    closable
  />
  <bk-alert
    theme="warning"
    :title="t('警告的提示文字')"
    :close-text="t('删掉')"
    closable
  />
</template>

<script>
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  import BkAlert from '@bkui-vue/alert';
  export default defineComponent({
    components: {
      BkAlert,
    },
    setup() {
      const { t } = useI18n();

      return {
        t,
      };
    },
  });
</script>

<style lang="postcss">
.bk-alert ~ .bk-alert {
  margin-top: 20px;
}
</style>
