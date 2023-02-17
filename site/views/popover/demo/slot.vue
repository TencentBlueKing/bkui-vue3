<template>
  <bk-popover
    placement="top"
    width="490"
  >
    <bk-button>{{ t("超长") }}</bk-button>
    <template #content>
      <div>
        <span>{{ t('今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错') }}</span>
        <span>{{ t('今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错') }}</span>
        <span>{{ t('今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错') }}</span>
        <span>{{ t('今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错') }}</span>
        <span>{{ t('今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错') }}</span>
        <span>{{ t('今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错') }}</span>
        <span>{{ t('今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错') }}</span>
        <span>{{ t('今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错') }}</span>
        <span>{{ t('今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错') }}</span>
        <span>{{ t('今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错') }}</span>
        <span>{{ t('今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错') }}</span>
      </div>
    </template>
  </bk-popover>
</template>

<script>
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    setup() {
      const { t } = useI18n();
      return {
        t,
      };
    },
  });
</script>
