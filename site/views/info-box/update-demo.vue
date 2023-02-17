<template>
  <div>
    <bk-button
      theme="primary"
      @click="handleDefault"
    >
      {{ t('点击删除(成功)') }}
    </bk-button>
    <bk-button
      style="margin-left: 15px"
      theme="primary"
      @click="handleDefault2"
    >
      {{ t('点击删除(失败)') }}
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

      const confirmA = InfoBox({
        title: t('确认要删除？'),
        confirmText: t('确定'),
        cancelText: t('取消'),
        isShow: false,
        headerAlign: 'center',
        footerAlign: 'center',
        isLoading: false,
        onConfirm() {},
      });

      const handleDefault = () => {
        confirmA.show();
      };

      const handleDefault2 = () => {
        confirmA.update({
          title: t('确认要删除？'),
          subTitle: '22222',
          confirmText: t('确定'),
          cancelText: t('取消'),
          onConfirm() {
            console.log('22');
          },
        });
        confirmA.show();
      };

      return {
        confirmA,
        handleDefault,
        handleDefault2,
        t,
      };
    },
  });
</script>
