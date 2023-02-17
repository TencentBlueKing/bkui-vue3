<template>
  <div>
    <bk-tag-input
      v-model="state.tags"
      :placeholder="t('请选择城市')"
      :paste-fn="pasteFn"
      :list="state.list"
    />
    <p> {{ t('复制内容 guangzhou|chongqing|beijing 来体验粘贴多输入效果') }}</p>
  </div>
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
          { id: 'shanghai', name: t('上海') },
          { id: 'hangzhou', name: t('杭州') },
          { id: 'nanjing', name: t('南京') },
          { id: 'chongqing', name: t('重庆') },
          { id: 'taibei', name: t('台北') },
          { id: 'haikou', name: t('海口') },
        ],
      });
      const pasteFn = value => value.split('|').map(tag => ({ id: tag, name: tag }));

      return {
        state,
        pasteFn,
        t,
      };
    },
  });
</script>
