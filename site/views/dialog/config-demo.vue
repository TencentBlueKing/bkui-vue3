<template>
  <div>
    <bk-button
      class="mr10"
      @click="() => (exampleSetting.dialog1.isShow = true)"
    >
      {{ t('自定义内容') }}
    </bk-button>
    <bk-dialog
      :theme="'primary'"
      :title="t('这是标题')"
      :is-show="exampleSetting.dialog1.isShow"
      :confirm-text="exampleSetting.dialog1.confirmText"
      :cancel-text="exampleSetting.dialog1.cancelText"
      @closed="() => (exampleSetting.dialog1.isShow = false)"
      @confirm="() => (exampleSetting.dialog1.isShow = false)"
    >
      <bk-input :placeholder="t('文字个数不超过8个汉字')" />
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => (exampleSetting.dialog2.isShow = true)"
    >
      {{ t('不显示关闭 icon') }}
    </bk-button>
    <bk-dialog
      :theme="'primary'"
      :title="t('这是标题')"
      :is-show="exampleSetting.dialog2.isShow"
      :confirm-text="exampleSetting.dialog2.confirmText"
      :cancel-text="exampleSetting.dialog2.cancelText"
      :close-icon="false"
      @closed="() => (exampleSetting.dialog2.isShow = false)"
      @confirm="() => (exampleSetting.dialog2.isShow = false)"
    >
      <div>{{ t('不显示关闭 icon') }}</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => (exampleSetting.dialog3.isShow = true)"
    >
      {{ t('配置按钮文案') }}
    </bk-button>
    <bk-dialog
      :theme="'primary'"
      :title="t('这是标题')"
      :is-show="exampleSetting.dialog3.isShow"
      :confirm-text="t('按钮1')"
      :cancel-text="t('按钮2')"
      @closed="() => (exampleSetting.dialog3.isShow = false)"
      @confirm="() => (exampleSetting.dialog3.isShow = false)"
    >
      <div>{{ t('配置按钮文案') }}</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => (exampleSetting.dialog4.isShow = true)"
    >
      {{ t('不允许拖拽') }}
    </bk-button>
    <bk-dialog
      :title="t('这是标题')"
      :is-show="exampleSetting.dialog4.isShow"
      :confirm-text="exampleSetting.dialog4.confirmText"
      :cancel-text="exampleSetting.dialog4.cancelText"
      :draggable="false"
      @closed="() => (exampleSetting.dialog4.isShow = false)"
      @confirm="() => (exampleSetting.dialog4.isShow = false)"
    >
      <div>{{ t('不允许拖拽') }}</div>
    </bk-dialog>
  </div>
</template>

<script>
  import { defineComponent, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';

  import BkButton from '@bkui-vue/button';
  import BkDialog from '@bkui-vue/dialog';
  import BkInput from '@bkui-vue/input';
  export default defineComponent({
    components: {
      BkButton,
      BkDialog,
      BkInput,
    },
    setup() {
      const { t } = useI18n();

      const exampleSetting = reactive({
        dialog1: {
          isShow: false,
          confirmText: t('确定'),
          cancelText: t('取消'),
        },
        dialog2: {
          isShow: false,
          confirmText: t('确定'),
          cancelText: t('取消'),
        },
        dialog3: {
          isShow: false,
        },
        dialog4: {
          isShow: false,
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
