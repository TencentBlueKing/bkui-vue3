<template>
  <bk-popover
    :content="t('这里是提示文字当鼠标经过这段文字时，会显示一个气泡框当鼠标经过这段文字时，会显示一个气泡框当鼠标经过这段文字时')"
    theme="light xxxxx"
    width="400"
  >
    <div>
      {{ t('当鼠标经过这段文字时，会显示一个气泡框') }}
    </div>
  </bk-popover>
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
