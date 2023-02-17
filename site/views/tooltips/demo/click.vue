<template>
  <span
    v-bk-tooltips="config"
    class="bk-tooltips-base"
  >
    <info />
  </span>
</template>

<script>
  import { bkTooltips } from 'bkui-vue';
  import { Info } from 'bkui-vue/lib/icon';
  import { defineComponent } from 'vue';
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
      const config = {
        content: t('提示信息'),
        trigger: 'click',
        theme: 'light',
      };
      return {
        config,
      };
    },
  });
</script>

<style lang="postcss">
.bk-tooltips-base {
  font-size: 18px;
  color: #3a84ff;
  cursor: pointer;
}
</style>
