<template>
  <div>
    <bk-process
      :list="state.list"
      :controllable="state.controllable"
      :cur-process="state.curprocess"
      @click="processChanged"
    />
  </div>
</template>;
<script>
  import { Bk } from 'bkui-vue/lib/icon';
  import { defineComponent, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const state = reactive({
        list: [
          { content: t('测试一'), description: t('这是描述') },
          { content: t('测试二'), description: t('这是描述2'), status: 'loading' },
          { content: t('测试三'), description: t('这是描述3'), status: 'error'  },
          { content: t('测试四'), description: t('这是描述4'), icon: Bk },
          { content: t('测试五'), description: t('这是描述5') },
        ],
        controllable: true,
        curprocess: 3,
      });

      // 改变当前选中值
      const processChanged = (index) => {
        state.curprocess = index;
      };

      return {
        state,
        processChanged,
      };
    },
  });
</script>
