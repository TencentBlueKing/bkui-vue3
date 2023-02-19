<template>
  <div>
    <bk-button
      class="mr10"
      :theme="'primary'"
      @click="() => exampleSetting.dialog.isShow = true"
    >
      {{ t("嵌套弹框") }}
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting.dialog.isShow"
      :title="t('描述')"
      :size="'medium'"
      :quick-close="false"
      @closed="() => exampleSetting.dialog.isShow = false"
      @confirm="() => exampleSetting.dialog.isShow = false"
    >
      <bk-button
        class="mr10"
        @click="() => nestedDialog1.isShow = true"
      >
        {{ t("打开嵌套弹框") }}
      </bk-button>
      <bk-button @click="() => nestedDialog2.isShow = true">
        {{ t("打开侧弹框") }}
      </bk-button>
    </bk-dialog>

    <bk-dialog
      :is-show="nestedDialog1.isShow"
      :quick-close="false"
      @closed="() => nestedDialog1.isShow = false"
      @confirm="() => nestedDialog1.isShow = false"
    >
      <div>{{ t("嵌套的弹框内容~") }}</div>
    </bk-dialog>

    <bk-sideslider
      :is-show="nestedDialog2.isShow"
      @closed="() => nestedDialog2.isShow = false"
    >
      <div>sideslider</div>
      <bk-button @click="nestedDialog3.isShow = true">
        {{ t("打开弹窗") }}
      </bk-button>
      <bk-dialog
        :is-show="nestedDialog3.isShow"
        :quick-close="false"
        @closed="() => nestedDialog3.isShow = false"
        @confirm="() => nestedDialog3.isShow = false"
      >
        <div>{{ t("嵌套的弹框内容~") }}</div>
      </bk-dialog>
    </bk-sideslider>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import BkButton from '@bkui-vue/button';
  import BkDialog from '@bkui-vue/dialog';
  import BkSideslider from '@bkui-vue/sideslider';

  export default defineComponent({
    components: {
      BkButton,
      BkDialog,
      BkSideslider,
    },
    setup() {
      const { t } = useI18n();
      const exampleSetting = ref({
        dialog: {
          isShow: false,
          confirmText: t('确定'),
          cancelText: t('取消'),
        },
      });

      const nestedDialog1 = ref({
        isShow: false,
        confirmText: t('确定'),
        cancelText: t('取消'),
      });

      const nestedDialog2 = ref({
        isShow: false,
        confirmText: t('确定'),
        cancelText: t('取消'),
      });

      const nestedDialog3 = ref({
        isShow: false,
        confirmText: t('确定'),
        cancelText: t('取消'),
      });

      return {
        exampleSetting,
        nestedDialog1,
        nestedDialog2,
        nestedDialog3,
        t,
      };
    },
  });
</script>
