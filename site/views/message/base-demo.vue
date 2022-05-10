<template>
  <bk-button
    type="primary"
    @click="handleDefault"
  >
    默认配置的消息提示
  </bk-button>
</template>

<script>
  import BkMessage from '@bkui-vue/message';

  export default {
    name: 'BaseDemo',
    methods: {
      handleDefault() {
        BkMessage('选择你导入的构建机并填写相关信息，系统将为你安装必要的软件');
      },
    },
  };
</script>
