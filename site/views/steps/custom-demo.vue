<template>
  <div>
    <bk-steps
      :controllable="state.controllable"
      :cur-step="state.curStep"
      :steps="state.objectSteps"
      class="mb20"
      @click="stepChanged"
    />
  </div>
</template>
<script>
  import { Bk } from 'bkui-vue/lib/icon';
  import { defineComponent, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const state = reactive({
        objectSteps: [
          { title: t('测试一'), icon: Bk, description: t('这是描述') },
          { title: t('测试二'), icon: 2, description: t('这是描述2'), status: 'error' },
          { title: t('测试三'), icon: 3  },
          { title: t('测试四') },
        ],
        curStep: 1,
        controllable: true,
      });


      // 改变当前选中值
      const stepChanged = (index) => {
        state.curStep = index;
      };
      return {
        state,
        stepChanged,
      };
    },
  });

</script>
<style>
.mb20 {
  margin-bottom: 20px
}
</style>
