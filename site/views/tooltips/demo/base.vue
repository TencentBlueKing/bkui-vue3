<template>
  <span
    ref="nodeRef"
    v-bk-tooltips="tips"
    class="bk-tooltips-base"
  >
    <info />
  </span>
</template>

<script>
  import { bkTooltips } from 'bkui-vue';
  import { Info } from 'bkui-vue/lib/icon';
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    components: {
      Info,
    },
    directives: {
      bkTooltips,
    },
    setup() {
      const { t } = useI18n();
      const tips = ref({ content: t('提示信息'), delay: 3000 });

      return {
        tips,
      };
    },
  });
</script>

<style lang="postcss">
.bk-tooltips-base {
  font-size: 18px;
  color: #3a84ff;
}
</style>
