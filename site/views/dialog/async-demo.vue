<template>
  <div>
    <bk-button
      @click="() => exampleSetting.isShow = true"
    >
      {{ t('异步关闭') }}
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting.isShow"
      :title="t('文本标题')"
      :theme="'primary'"
      :confirm-text="exampleSetting.confirmText"
      :cancel-text="exampleSetting.cancelText"
      :is-loading="exampleSetting.loading"
      @closed="() => exampleSetting.isShow = false"
      @confirm="handleConfirm"
    >
      <div> {{ t("点击确定后") }} {{ exampleSetting.countdown }} {{ t('秒关闭') }}</div>
    </bk-dialog>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import BkButton from '@bkui-vue/button';
  import BkDialog from '@bkui-vue/dialog';

  export default defineComponent({
    components: {
      BkButton,
      BkDialog,
    },
    setup() {
      const { t } = useI18n();
      const exampleSetting = ref({
        isShow: false,
        loading: false,
        countdown: 3,
        timer: null,
        confirmText: t('确定'),
        cancelText: t('取消'),
      });

      const handleConfirm = () => {
        exampleSetting.value.loading = true;
        exampleSetting.value.timer = setInterval(() => {
          exampleSetting.value.countdown -= 1;
          if (exampleSetting.value.countdown === 0) {
            exampleSetting.value.isShow = false;
            exampleSetting.value.loading = false;
            exampleSetting.value.confirmText = t('确定');
            exampleSetting.value.countdown = 3;
            clearInterval(exampleSetting.value.timer);
          }
        }, 1000);
      };

      return {
        exampleSetting,
        handleConfirm,
        t,
      };
    },
  });
</script>

