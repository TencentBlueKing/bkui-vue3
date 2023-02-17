<template>
  <bk-popover
    always
    boundary="#oooxxxvvv"
    placement="right"
    width="300"
    :content="t('这里是提示文字当鼠标经过这段文字时，会显示一个气泡框当鼠标经过这段文字时，会显示一个气泡框当鼠标经过这段文字时')"
  >
    <bk-button>{{ t('总是显示') }}</bk-button>
  </bk-popover>
  <div id="oooxxxvvv" />
</template>

<script>
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    setup() {
      const { t } = useI18n();
      return {
        t,
      };
    },
  });
</script>

