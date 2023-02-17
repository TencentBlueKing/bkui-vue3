<template>
  <div>
    <bk-timeline
      :list="state.list"
    />
  </div>
</template>
<script>
  import { defineComponent, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const state = reactive({
        list: [
          {
            tag: t('一天前'),
            content: t('由pony上线到蓝鲸市场'),
          },
          {
            tag: t('步骤1'),
            content: `<div style="color: red;">${t('由')}<strong>tony</strong>${t('部署到生产环境并发布至应用市场')}</div>`,
          },
          {
            tag: t('步骤1'),
            content: `<div>${t('由')}<strong>allen</strong>${t('上线到')}<span style="color: #3c96ff;">${t('蓝鲸市场')}</span></div>`,
          },
          {
            tag: t('步骤3'),
            content: `${t('由')}<strong>tony</strong>${t('部署到')}<p style="color: #ff5656">${t('生产环境')}</p>${t('并发布至')}<strong>${t('应用市场')}</strong>`,
          },
          {
            tag: t('步骤4'),
            content: `${t('由')}<strong>allen</strong>${t('部署到预发布环境')}`,
          },
        ],
      });
      return {
        state,
        t,
      };
    },
  });

</script>
