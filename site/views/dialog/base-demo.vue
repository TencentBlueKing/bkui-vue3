<template>
  <div>
    <bk-button
      theme="primary"
      @click="() => exampleSetting.dialog.isShow = true"
    >
      primary-1
    </bk-button>
    <bk-dialog
      theme="primary"
      :title="t('描述')"
      :is-show="exampleSetting.dialog.isShow"
      :confirm-text="exampleSetting.dialog.confirmText"
      :cancel-text="exampleSetting.dialog.cancelText"
      quick-close
      @closed="() => exampleSetting.dialog.isShow = false"
      @confirm="() => exampleSetting.dialog.isShow = false"
    >
      <div>{{ t('primary 主题，点击遮罩不会关闭弹框，esc 按键会关闭弹框') }}</div>
      <bk-button @click="() => exampleSetting.dialog.isShow2 = true">
        Show-2
      </bk-button>
      <bk-dialog
        theme="primary"
        :title="t('描述-嵌套2')"
        :is-show="exampleSetting.dialog.isShow2"
        :confirm-text="exampleSetting.dialog.confirmText"
        :cancel-text="exampleSetting.dialog.cancelText"
        quick-close
        @closed="() => exampleSetting.dialog.isShow2 = false"
        @confirm="() => exampleSetting.dialog.isShow2 = false"
      >
        <bk-button @click="() => exampleSetting.dialog.isShow3 = true">
          Show-3
        </bk-button>
        <bk-dialog
          theme="primary"
          :is-show="exampleSetting.dialog.isShow3"
          :title="t('描述-嵌套3')"
          :confirm-text="exampleSetting.dialog.confirmText"
          :cancel-text="exampleSetting.dialog.cancelText"
          quick-close
          @closed="() => exampleSetting.dialog.isShow3 = false"
          @confirm="() => exampleSetting.dialog.isShow3 = false"
        />
      </bk-dialog>
    </bk-dialog>
  </div>
</template>

<script>
  import { defineComponent, reactive } from 'vue';
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
      const exampleSetting = reactive({
        dialog: {
          isShow: false,
          isShow2: false,
          isShow3: false,
          confirmText: t('确定'),
          cancelText: t('取消'),
        },
      });

      return {
        exampleSetting,
        t,
      };
    },
  });
</script>
