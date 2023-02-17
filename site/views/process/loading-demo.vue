<template>
  <div>
    <bk-process
      :list="state.list"
      :cur-process="state.curprocess"
    />
  </div>
</template>;
<script>
  import { defineComponent, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const state = reactive({
        list: [
          { content: t('测试一'), description: t('这是描述') },
          { content: t('测试二'), description: t('这是描述2'), status: 'loading' },
          { content: t('测试三')  },
          { content: t('测试四') },
        ],
        curprocess: 2,
      });

      return {
        state,
      };
    },
  });
</script>
