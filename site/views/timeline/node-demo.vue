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
            type: 'default',
          },
          {
            tag: t('步骤1'),
            content: '<span style="font-size: 12px;">2019-12-15 11:00</span>',
            type: 'primary',
          },
          {
            tag: t('步骤2'),
            content: '<span style="font-size: 12px;">2020-12-15 11:00</span>',
            type: 'warning',
          },
          {
            tag: t('步骤3'),
            content: '<span style="font-size: 12px;">2021-12-15 11:00</span>',
            type: 'success',
          },
          {
            tag: t('步骤4'),
            content: '<span style="font-size: 12px;">2022-12-15 11:00</span>',
            type: 'danger',
          },
        ],
      });
      return {
        state,
      };
    },
  });

</script>
