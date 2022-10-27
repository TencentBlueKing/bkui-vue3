<template>
  <div>
    <bk-button
      type="primary"
      @click="handleSingle({delay: 10000})"
    >
      10s 后关闭
    </bk-button>&nbsp;&nbsp;
    <bk-button
      type="primary"
      @click="handleSingle({delay: 0})"
    >
      不自动关闭
    </bk-button>&nbsp;&nbsp;
    <bk-button
      type="primary"
      @click="handleSingle({dismissable: false})"
    >
      不显示关闭 icon
    </bk-button>
  </div>
</template>

<script setup>
  import { Message } from 'bkui-vue';

  const  handleSingle = (config) => {
    const messageConfig = {
      message: '选择你导入的构建机并填写相关信息，系统将为你安装必要的软件',
      ...config,
    };
    Message(messageConfig);
  };
</script>
