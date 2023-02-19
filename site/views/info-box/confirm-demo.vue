<template>
  <div>
    <bk-button
      type="primary"
      @click="handleDefault"
    >
      {{ t('直接使用') }}
    </bk-button>
    <bk-button
      style="margin-left: 15px"
      type="primary"
      @click="handleDefault2"
    >
      {{ t('更新infoBox') }}
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

      const confirmInstance = InfoBox({
        isShow: false,
      });

      const handleDefault = () => {
        InfoBox({
          title: t('确认要删除？'),
          confirmText: t('确认'),
          cancelText: t('取消'),
          dialogType: 'confirm',
          headerAlign: 'center',
          footerAlign: 'center',
          onConfirm() {
            return confirm(t('确认要删除？'));
          },
        });
      };

      const Confirm = (opts) => {
        confirmInstance.update(opts);
        confirmInstance.show(opts);
      };

      const handleDefault2 = () => {
        Confirm({
          title: t('确认要删除？'),
          confirmText: t('确认'),
          cancelText: t('取消'),
          dialogType: 'confirm',
          headerAlign: 'center',
          footerAlign: 'center',
          onConfirm() {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(true);
              }, 100);
            });
          },
        });
      };

      return {
        confirmInstance,
        handleDefault,
        handleDefault2,
        t,
      };
    },
  });
</script>
