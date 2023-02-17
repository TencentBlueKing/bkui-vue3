<template>
  <bk-compose-form-item>
    <bk-input
      :placeholder="t('请输入')"
      clearable
    />
    <bk-select>
      <bk-option
        value="1"
        :label="t('本科以下')"
      />
      <bk-option
        value="2"
        :label="t('本科以上')"
      />
    </bk-select>
    <bk-input
      :placeholder="t('请输入')"
      type="number"
    />
    <bk-tag-input
      :list="list"
      style="width: 100px;"
      :placeholder="t('请输入并按 Enter 结束')"
    />
    <bk-date-picker />
  </bk-compose-form-item>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { BkComposeFormItem } from '@bkui-vue/form';
  import BkInput from '@bkui-vue/input';
  import BkSelect, { BkOption } from '@bkui-vue/select';
  import BkTagInput from '@bkui-vue/tag-input';
  export default defineComponent({
    components: {
      BkComposeFormItem,
      BkInput,
      BkSelect,
      BkOption,
      BkTagInput,
    },
    setup() {
      const { t } = useI18n();
      const list = ref([
        { id: 'shenzhen', name: t('深圳') },
        { id: 'guangzhou', name: t('广州') },
        { id: 'beijing', name: t('北京') },
        { id: 'shanghai', name: t('上海') },
        { id: 'hangzhou', name: t('杭州') },
        { id: 'nanjing', name: t('南京') },
        { id: 'chongqing', name: t('重庆') },
        { id: 'taibei', name: t('台北') },
        { id: 'haikou', name: t('海口') },
      ]);

      return {
        list,
        t,
      };
    },
  });

</script>
