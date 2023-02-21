<template>
  <div>
    <bk-button
      theme="primary"
      @click="() => (exampleSetting.dialog.isShow = true)"
    >
      primary-1
    </bk-button>
    <bk-dialog
      theme="primary"
      :title="'description'"
      :is-show="exampleSetting.dialog.isShow"
      :confirm-text="exampleSetting.dialog.confirmText"
      :cancel-text="exampleSetting.dialog.cancelText"
      quick-close
      @closed="() => (exampleSetting.dialog.isShow = false)"
      @confirm="() => (exampleSetting.dialog.isShow = false)"
    >
      <div>
        Primary theme, clicking the mask will not close the pop-up box, and the esc button will close the pop-up box
      </div>
      <bk-button @click="() => (exampleSetting.dialog.isShow2 = true)">
        Show-2
      </bk-button>
      <bk-dialog
        theme="primary"
        :title="'Description - Nested 2'"
        :is-show="exampleSetting.dialog.isShow2"
        :confirm-text="exampleSetting.dialog.confirmText"
        :cancel-text="exampleSetting.dialog.cancelText"
        quick-close
        @closed="() => (exampleSetting.dialog.isShow2 = false)"
        @confirm="() => (exampleSetting.dialog.isShow2 = false)"
      >
        <bk-button @click="() => (exampleSetting.dialog.isShow3 = true)">
          Show-3
        </bk-button>
        <bk-dialog
          theme="primary"
          :is-show="exampleSetting.dialog.isShow3"
          :title="'Description - Nested 3'"
          :confirm-text="exampleSetting.dialog.confirmText"
          :cancel-text="exampleSetting.dialog.cancelText"
          quick-close
          @closed="() => (exampleSetting.dialog.isShow3 = false)"
          @confirm="() => (exampleSetting.dialog.isShow3 = false)"
        />
      </bk-dialog>
    </bk-dialog>
  </div>
</template>

<script>
  import { defineComponent, reactive } from 'vue';

  import BkButton from '@bkui-vue/button';
  import BkDialog from '@bkui-vue/dialog';

  export default defineComponent({
    components: {
      BkButton,
      BkDialog,
    },
    setup() {
      const exampleSetting = reactive({
        dialog: {
          isShow: false,
          isShow2: false,
          isShow3: false,
          confirmText: 'Confirm',
          cancelText: 'Cancel',
        },
      });

      return {
        exampleSetting,
      };
    },
  });
</script>
