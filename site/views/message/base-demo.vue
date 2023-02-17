<template>
  <bk-button
    type="primary"
    @click="handleDefault"
  >
    {{ t("默认配置的消息提示") }}
  </bk-button>
</template>

<script>
  import { Message } from 'bkui-vue';
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const handleDefault = () => {
        Message(t('选择你导入的构建机并填写相关信息，系统将为你安装必要的软件'));
      };

      return {
        handleDefault,
        t,
      };
    },
  });
</script>
