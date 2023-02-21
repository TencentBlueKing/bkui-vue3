<template>
  <div>
    <bk-button
      class="mr10"
      @click="() => exampleSetting.dialog1.isShow = true"
    >
      normal
    </bk-button>
    <bk-dialog
      :title="'This is the title'"
      :theme="'primary'"
      :size="'normal'"
      :is-show="exampleSetting.dialog1.isShow"
      :confirm-text="exampleSetting.dialog1.confirmText"
      :cancel-text="exampleSetting.dialog1.cancelText"
      @closed="() => exampleSetting.dialog1.isShow = false"
      @confirm="() => exampleSetting.dialog1.isShow = false"
    >
      <div>normal</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => exampleSetting.dialog2.isShow = true"
    >
      small
    </bk-button>
    <bk-dialog
      :title="'This is the title'"
      :theme="'primary'"
      :size="'small'"
      :is-show="exampleSetting.dialog2.isShow"
      :confirm-text="exampleSetting.dialog2.confirmText"
      :cancel-text="exampleSetting.dialog2.cancelText"
      @closed="() => exampleSetting.dialog2.isShow = false"
      @confirm="() => exampleSetting.dialog2.isShow = false"
    >
      <div>small</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => exampleSetting.dialog3.isShow = true"
    >
      medium
    </bk-button>
    <bk-dialog
      :title="'This is the title'"
      :theme="'primary'"
      :size="'medium'"
      :is-show="exampleSetting.dialog3.isShow"
      :confirm-text="exampleSetting.dialog3.confirmText"
      :cancel-text="exampleSetting.dialog3.cancelText"
      @closed="() => exampleSetting.dialog3.isShow = false"
      @confirm="() => exampleSetting.dialog3.isShow = false"
    >
      <div>medium</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => exampleSetting.dialog4.isShow = true"
    >
      large
    </bk-button>
    <bk-dialog
      :title="'This is the title'"
      :theme="'primary'"
      :size="'large'"
      :is-show="exampleSetting.dialog4.isShow"
      :confirm-text="exampleSetting.dialog4.confirmText"
      :cancel-text="exampleSetting.dialog4.cancelText"
      @closed="() => exampleSetting.dialog4.isShow = false"
      @confirm="() => exampleSetting.dialog4.isShow = false"
    >
      <div>large</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => exampleSetting.dialog5.isShow = true"
    >
      <div>Custom width and height</div>
    </bk-button>
    <bk-dialog
      :title="'This is the title'"
      :theme="'primary'"
      :width="400"
      :height="200"
      :is-show="exampleSetting.dialog5.isShow"
      :confirm-text="exampleSetting.dialog5.confirmText"
      :cancel-text="exampleSetting.dialog5.cancelText"
      @closed="() => exampleSetting.dialog5.isShow = false"
      @confirm="() => exampleSetting.dialog5.isShow = false"
    >
      <div>Custom width and height</div>
    </bk-dialog>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  import BkButton from '@bkui-vue/button';
  import BkDialog from '@bkui-vue/dialog';
  export default defineComponent({
    components: {
      BkButton,
      BkDialog,
    },
    setup() {
      const exampleSetting = ref({
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
          confirmText: 'Confirm',
          cancelText: 'Cancel',
        },
        dialog4: {
          isShow: false,
          confirmText: 'Confirm',
          cancelText: 'Cancel',
        },
        dialog5: {
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

<style lang="postcss">
.mr10 {
  margin-right: 10px;
}
</style>
