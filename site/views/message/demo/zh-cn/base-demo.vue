<template>
  <bk-button
    type="primary"
    @click="handleDefault"
  >
    默认配置的消息提示
  </bk-button>
</template>

<script>
  import { Message } from 'bkui-vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      const handleDefault = () => {
        Message('选择你导入的构建机并填写相关信息，系统将为你安装必要的软件');
      };

      return {
        handleDefault,
      };
    },
  });
</script>
