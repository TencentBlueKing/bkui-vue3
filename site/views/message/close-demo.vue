<template>
  <div>
    <bk-button
      type="primary"
      @click="handleSingle({ delay: 10000 })"
    >
      <span>{{ t("10s 后关闭") }}</span>
    </bk-button>&nbsp;&nbsp;
    <bk-button
      type="primary"
      @click="handleSingle({ delay: 0 })"
    >
      <span>{{ t("不自动关闭") }}</span>
    </bk-button>&nbsp;&nbsp;
    <bk-button
      type="primary"
      @click="handleSingle({ dismissable: false })"
    >
      {{ t("不显示关闭 icon") }}
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

      const handleSingle = (config) => {
        const messageConfig = {
          message: t('选择你导入的构建机并填写相关信息，系统将为你安装必要的软件'),
          ...config,
        };
        Message(messageConfig);
      };

      return {
        handleSingle,
        t,
      };
    },
  });
</script>
