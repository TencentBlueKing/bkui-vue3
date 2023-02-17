<template>
  <div>
    <bk-tag-input
      v-model="state.tags"
      :placeholder="t('请选择城市')"
      :list="state.list"
    />
    <p>{{ t('请输入“州”来体验下搜索效果') }}</p>
  </div>
</template>

<script>
  import { defineComponent, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';

  import BkTagInput from '@bkui-vue/tag-input';
  export default defineComponent({
    components: {
      BkTagInput,
    },
    setup() {
      const { t } = useI18n();
      const state = reactive({
        tags: ['shenzhen'],
        list: [
          { id: 'shenzhen', name: t('深圳') },
          { id: 'guangzhou', name: t('广州') },
          { id: 'beijing', name: t('北京') },
          { id: 'shanghai', name: t('上海') },
          { id: 'hangzhou', name: t('杭州') },
          { id: 'nanjing', name: t('南京') },
          { id: 'chongqing', name: t('重庆') },
          { id: 'taibei', name: t('台北') },
          { id: 'haikou', name: t('海口') },
        ],
      });

      return {
        state,
        t,
      };
    },
  });
</script>
