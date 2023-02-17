<template>
  <div>
    <bk-timeline
      :list="state.list"
      @select="timeLineChanged"
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
            size: 'large',
          },
          {
            tag: t('步骤1'),
            content: '<span style="font-size: 12px;">2019-12-15 11:00</span>',
          },
          {
            tag: t('步骤2'),
            content: '<span style="font-size: 12px;">2020-12-15 11:00</span>',
          },
          {
            tag: t('步骤3'),
            content: '<span style="font-size: 12px;">2021-12-15 11:00</span>',
          },
          {
            tag: t('步骤4'),
            content: '<span style="font-size: 12px;">2022-12-15 11:00</span>',
          },
        ],
      });

      // 改变当前选中值
      const timeLineChanged = (data) => {
        alert(`选择了：${data.tag}`);
      };
      return {
        state,
        timeLineChanged,
      };
    },
  });

</script>
