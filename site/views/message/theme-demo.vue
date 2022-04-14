<template>
  <div>
    <bk-button
      theme="primary"
      @click="handlePrimary"
    >
      消息
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="success"
      @click="handleSuccess"
    >
      成功
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="warning"
      @click="handleWarning"
    >
      警告
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="danger"
      @click="handleError"
    >
      失败
    </bk-button>
  </div>
</template>

<script>
import BkMessage from '@bkui-vue/message';

export default {
  name: 'ThemeDemo',
  data() {
    return {};
  },
  methods: {
    handlePrimary() {
      BkMessage({
        theme: 'primary',
        message: '选择你导入的构建机并填写相关信息，系统将为你安装必要的软件',
      });
    },
    handleSuccess() {
      BkMessage({
        theme: 'success',
        message: '恭喜！你提交的申请已经审核通过，请及时跟进了解下一步操作方式',
      });
    },
    handleWarning() {
      BkMessage({
        theme: 'warning',
        message: '系统即将于19：00-21：00进行升个级，请及时保存你的资料',
      });
    },
    handleError() {
      BkMessage({
        theme: 'error',
        message: '系统错误，请稍后重试',
      });
    },
  },
};
</script>
