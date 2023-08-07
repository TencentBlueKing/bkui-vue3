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

<script setup>
  import { Message } from 'bkui-vue';
  import { h } from 'vue';

  const handlePrimary = () => {
    Message({
      theme: 'primary',
      message: '选择你导入的构建机并填写相关信息，系统将为你安装必要的软件',
    });
  };
  const handleSuccess = () => {
    Message({
      theme: 'success',
      message: h('div', '恭喜！你提交的申请已经审核通过，请及时跟进了解下一步操作方式'),
    });
  };
  const handleWarning = () => {
    Message({
      theme: 'warning',
      message: '系统即将于19：00-21：00进行升个级，请及时保存你的资料',
    });
  };
  const handleError = () => {
    Message({
      theme: 'error',
      message: '系统错误，请稍后重试',
    });
  };
</script>
