<template>
  <bk-tag-input
    v-model="state.tags"
    :placeholder="t('请选择城市')"
    trigger="focus"
    :list="state.list"
  />
</template>

<script>
  import { defineComponent, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';;
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const state = reactive({
        tags: ['shenzhen'],
        list: [
          { id: 'shenzhen', name: t('深圳') },
          { id: 'guangzhou', name: t('广州') },
          { id: 'beijing', name: t('北京') },
          { id: 'shanghai', name: t('上海'), disabled: true },
          { id: 'hangzhou', name: t('杭州') },
          { id: 'nanjing', name: t('南京'), disabled: true },
          { id: 'chongqing', name: t('重庆') },
          { id: 'taibei', name: t('台北') },
          { id: 'haikou', name: t('海口'), disabled: true },
        ],
      });

      return {
        state,
        t,
      };
    },
  });
</script>
