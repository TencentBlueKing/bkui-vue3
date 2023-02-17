<template>
  <bk-popover
    placement="bottom"
    :content="t('文字提示')"
    @after-hidden="handleHide"
    @after-show="handleShow"
  >
    <bk-button>{{ t('自定义回调函数') }}</bk-button>
  </bk-popover>
</template>

<script>
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  import BkMessage from '@bkui-vue/message';
  export default defineComponent({
    setup() {
      const  { t } = useI18n();

      const handleShow = () => {
        BkMessage({
          theme: 'success',
          message: 'onShow',
        });
      };

      const handleHide = () => {
        BkMessage({
          theme: 'error',
          message: 'onClose',
        });
      };

      return {
        handleShow,
        handleHide,
        t,
      };
    },
  });
</script>
