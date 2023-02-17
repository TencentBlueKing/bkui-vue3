<template>
  <div class="wrapper">
    <bk-container :col="12">
      <bk-row>
        <bk-col :span="4">
          <div class="content">
            <bk-timeline
              :list="state.list"
            />
          </div>
        </bk-col>
        <bk-col :span="4">
          <div class="content">
            <bk-timeline
              :list="state.list1"
            />
          </div>
        </bk-col>
        <bk-col :span="4">
          <div class="content">
            <bk-timeline
              :list="state.list2"
            />
          </div>
        </bk-col>
      </bk-row>
    </bk-container>
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
            tag: t('pony审批通过，并附“同意”'),
            content: t('由pony上线到蓝鲸市场'),
            color: 'green',
            filled: true,
          },
          {
            tag: t('tony审批通过，并附“同意”'),
            content: '<span style="font-size: 12px;">2019-12-15 11:00</span>',
            color: 'green',
            filled: true,
          },
          {
            tag: t('allen正在审批'),
            content: '<span style="font-size: 12px;">2020-12-15 11:00</span>',
            color: 'blue',
            size: 'large',
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

        list1: [
          {
            tag: t('pony审批通过，并附“同意”'),
            content: t('由pony上线到蓝鲸市场'),
            color: 'green',
            filled: true,
          },
          {
            tag: t('tony审批通过，并附“同意”'),
            content: '<span style="font-size: 12px;">2019-12-15 11:00</span>',
            color: 'green',
            filled: true,
          },
          {
            tag: t('allen审批不通过，并附“不同意”'),
            content: '<span style="font-size: 12px;">2020-12-15 11:00</span>',
            color: 'red',
            size: 'large',
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

        list2: [
          {
            tag: t('pony审批通过，并附“同意”'),
            content: t('由pony上线到蓝鲸市场'),
            color: 'green',
            filled: true,
          },
          {
            tag: t('tony审批通过，并附“同意”'),
            content: '<span style="font-size: 12px;">2019-12-15 11:00</span>',
            color: 'blue',
            filled: true,
          },
          {
            tag: t('allen暂停审批'),
            content: '<span style="font-size: 12px;">2020-12-15 11:00</span>',
            color: 'yellow',
            size: 'large',
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

      return {
        state,
      };
    },
  });

</script>
<style lang="postcss">
  .wrapper {
    padding: 20px 0;
    overflow: hidden;
    border: 1px solid #ddd;
    border-radius: 2px;
  }
</style>
