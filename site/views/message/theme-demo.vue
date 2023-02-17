<template>
  <div>
    <bk-button
      theme="primary"
      @click="handlePrimary"
    >
      {{ t("消息") }}
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="success"
      @click="handleSuccess"
    >
      {{ t("成功") }}
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="warning"
      @click="handleWarning"
    >
      {{ t("警告") }}
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="danger"
      @click="handleError"
    >
      {{ t('失败') }}
    </bk-button>
  </div>
</template>

<script>
  import { Message } from 'bkui-vue';
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();

      const handlePrimary = () => {
        Message({
          theme: 'primary',
          message: t('选择你导入的构建机并填写相关信息，系统将为你安装必要的软件'),
        });
      };

      const handleSuccess = () => {
        Message({
          theme: 'success',
          message: t('恭喜！你提交的申请已经审核通过，请及时跟进了解下一步操作方式'),
        });
      };

      const handleWarning = () => {
        Message({
          theme: 'warning',
          message: t('系统即将于19：00-21：00进行升个级，请及时保存你的资料'),
        });
      };

      const handleError = () => {
        Message({
          theme: 'error',
          message: t('系统错误，请稍后重试'),
        });
      };

      return {
        handlePrimary,
        handleSuccess,
        handleWarning,
        handleError,
        t,
      };
    },
  });
</script>
