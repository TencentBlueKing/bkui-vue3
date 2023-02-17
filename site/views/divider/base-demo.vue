<template>
  <div>
    <div>{{ t('第1段落') }}</div>
    <bk-divider>{{ t('分割线') }}</bk-divider>
    <div>{{ t('第2段落') }}</div>
    <bk-divider align="left">
      {{ t('分割线') }}
    </bk-divider>
    <div>{{ t('第3段落') }}</div>
    <bk-divider align="right">
      {{ t('分割线') }}
    </bk-divider>
    <div>{{ t('第4段落') }}</div>
    <bk-divider type="dashed">
      {{ t('分割线') }}
    </bk-divider>
    <div>{{ t('第5段落') }}</div>
    <bk-divider direction="vertical" />
  </div>
</template>

<script lang="ts">
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

