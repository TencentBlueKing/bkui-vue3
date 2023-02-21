<template>
  <div>
    <bk-button
      class="mr10"
      @click="() => (exampleSetting.dialog1.isShow = true)"
    >
      Custom content
    </bk-button>
    <bk-dialog
      :theme="'primary'"
      :title="'This is the title'"
      :is-show="exampleSetting.dialog1.isShow"
      :confirm-text="exampleSetting.dialog1.confirmText"
      :cancel-text="exampleSetting.dialog1.cancelText"
      @closed="() => (exampleSetting.dialog1.isShow = false)"
      @confirm="() => (exampleSetting.dialog1.isShow = false)"
    >
      <bk-input
        :placeholder="'The number of characters shall not exceed 8 Chinese characters'"
      />
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => (exampleSetting.dialog2.isShow = true)"
    >
      Do not display the closing icon
    </bk-button>
    <bk-dialog
      :theme="'primary'"
      :title="'This is the title'"
      :is-show="exampleSetting.dialog2.isShow"
      :confirm-text="exampleSetting.dialog2.confirmText"
      :cancel-text="exampleSetting.dialog2.cancelText"
      :close-icon="false"
      @closed="() => (exampleSetting.dialog2.isShow = false)"
      @confirm="() => (exampleSetting.dialog2.isShow = false)"
    >
      <div>Do not display the closing icon</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => (exampleSetting.dialog3.isShow = true)"
    >
      Configure Button Text
    </bk-button>
    <bk-dialog
      :theme="'primary'"
      :title="'This is the title'"
      :is-show="exampleSetting.dialog3.isShow"
      :confirm-text="'Button 1'"
      :cancel-text="'Button 2'"
      @closed="() => (exampleSetting.dialog3.isShow = false)"
      @confirm="() => (exampleSetting.dialog3.isShow = false)"
    >
      <div>Configure Button Text</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => (exampleSetting.dialog4.isShow = true)"
    >
      Dragging is not allowed
    </bk-button>
    <bk-dialog
      :title="'This is the title'"
      :is-show="exampleSetting.dialog4.isShow"
      :confirm-text="exampleSetting.dialog4.confirmText"
      :cancel-text="exampleSetting.dialog4.cancelText"
      :draggable="false"
      @closed="() => (exampleSetting.dialog4.isShow = false)"
      @confirm="() => (exampleSetting.dialog4.isShow = false)"
    >
      <div>Dragging is not allowed</div>
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
          confirmText: 'Confirm',
          cancelText: 'Cancel',
        },
        dialog2: {
          isShow: false,
          confirmText: 'Confirm',
          cancelText: 'Cancel',
        },
        dialog3: {
          isShow: false,
        },
        dialog4: {
          isShow: false,
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
