<template>
  <div>
    <bk-button
      theme="primary"
      @click="handleDefault1"
    >
      {{ t('默认配置的提示框1') }}
    </bk-button>
    <bk-button
      theme="primary"
      style="margin-left: 15px"
      @click="handleDefault2"
    >
      {{ t('默认配置的提示框2') }}
    </bk-button>
  </div>
</template>

<script>
  import { InfoBox } from 'bkui-vue';
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();

      const handleDefault1 = () => {
        InfoBox({
          title: t('确认要删除？'),
          confirmText: t('确认'),
          cancelText: t('取消'),
          confirmFn() {},
        });
      };

      const handleDefault2 = () => {
        InfoBox({
          title: t('请确认是否重置'),
          subTitle: t('重置SecureKey，需要自行修改templates中的callback地址字段！'),
          confirmText: t('按钮1'),
          cancelText: t('按钮2'),
          onConfirm() {},
        });
      };

      return {
        handleDefault1,
        handleDefault2,
        t,
      };
    },
  });
</script>
