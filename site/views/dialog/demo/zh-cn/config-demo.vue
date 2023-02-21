<template>
  <div>
    <bk-button
      class="mr10"
      @click="() => (exampleSetting.dialog1.isShow = true)"
    >
      自定义内容
    </bk-button>
    <bk-dialog
      :theme="'primary'"
      :title="'这是标题'"
      :is-show="exampleSetting.dialog1.isShow"
      :confirm-text="exampleSetting.dialog1.confirmText"
      :cancel-text="exampleSetting.dialog1.cancelText"
      @closed="() => (exampleSetting.dialog1.isShow = false)"
      @confirm="() => (exampleSetting.dialog1.isShow = false)"
    >
      <bk-input :placeholder="'文字个数不超过8个汉字'" />
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => (exampleSetting.dialog2.isShow = true)"
    >
      不显示关闭 icon
    </bk-button>
    <bk-dialog
      :theme="'primary'"
      :title="'这是标题'"
      :is-show="exampleSetting.dialog2.isShow"
      :confirm-text="exampleSetting.dialog2.confirmText"
      :cancel-text="exampleSetting.dialog2.cancelText"
      :close-icon="false"
      @closed="() => (exampleSetting.dialog2.isShow = false)"
      @confirm="() => (exampleSetting.dialog2.isShow = false)"
    >
      <div>不显示关闭 icon</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => (exampleSetting.dialog3.isShow = true)"
    >
      配置按钮文案
    </bk-button>
    <bk-dialog
      :theme="'primary'"
      :title="'这是标题'"
      :is-show="exampleSetting.dialog3.isShow"
      :confirm-text="'按钮1'"
      :cancel-text="'按钮2'"
      @closed="() => (exampleSetting.dialog3.isShow = false)"
      @confirm="() => (exampleSetting.dialog3.isShow = false)"
    >
      <div>配置按钮文案</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => (exampleSetting.dialog4.isShow = true)"
    >
      不允许拖拽
    </bk-button>
    <bk-dialog
      :title="'这是标题'"
      :is-show="exampleSetting.dialog4.isShow"
      :confirm-text="exampleSetting.dialog4.confirmText"
      :cancel-text="exampleSetting.dialog4.cancelText"
      :draggable="false"
      @closed="() => (exampleSetting.dialog4.isShow = false)"
      @confirm="() => (exampleSetting.dialog4.isShow = false)"
    >
      <div>不允许拖拽</div>
    </bk-dialog>
  </div>
</template>

<script>
  import { defineComponent, reactive } from 'vue';

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
      const exampleSetting = reactive({
        dialog1: {
          isShow: false,
          confirmText: '确定',
          cancelText: '取消',
        },
        dialog2: {
          isShow: false,
          confirmText: '确定',
          cancelText: '取消',
        },
        dialog3: {
          isShow: false,
        },
        dialog4: {
          isShow: false,
          confirmText: '确定',
          cancelText: '取消',
        },
      });

      return {
        exampleSetting,
      };
    },
  });
</script>
