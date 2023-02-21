<template>
  <div>
    <bk-button
      class="mr10"
      :theme="'primary'"
      @click="() => exampleSetting.dialog.isShow = true"
    >
      Nested Dialog
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting.dialog.isShow"
      :title="'description'"
      :size="'medium'"
      :quick-close="false"
      @closed="() => exampleSetting.dialog.isShow = false"
      @confirm="() => exampleSetting.dialog.isShow = false"
    >
      <bk-button
        class="mr10"
        @click="() => nestedDialog1.isShow = true"
      >
        Open Nested Dialog
      </bk-button>
      <bk-button @click="() => nestedDialog2.isShow = true">
        Open the side dialog
      </bk-button>
    </bk-dialog>

    <bk-dialog
      :is-show="nestedDialog1.isShow"
      :quick-close="false"
      @closed="() => nestedDialog1.isShow = false"
      @confirm="() => nestedDialog1.isShow = false"
    >
      <div>Nested dialog contents~</div>
    </bk-dialog>

    <bk-sideslider
      :is-show="nestedDialog2.isShow"
      @closed="() => nestedDialog2.isShow = false"
    >
      <div>sideslider</div>
      <bk-button @click="nestedDialog3.isShow = true">
        Open pop-up window
      </bk-button>
      <bk-dialog
        :is-show="nestedDialog3.isShow"
        :quick-close="false"
        @closed="() => nestedDialog3.isShow = false"
        @confirm="() => nestedDialog3.isShow = false"
      >
        <div>Nested Dialog contents~</div>
      </bk-dialog>
    </bk-sideslider>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

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
      const exampleSetting = ref({
        dialog: {
          isShow: false,
          confirmText: 'Confirm',
          cancelText: 'Cancel',
        },
      });

      const nestedDialog1 = ref({
        isShow: false,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
      });

      const nestedDialog2 = ref({
        isShow: false,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
      });

      const nestedDialog3 = ref({
        isShow: false,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
      });

      return {
        exampleSetting,
        nestedDialog1,
        nestedDialog2,
        nestedDialog3,
      };
    },
  });
</script>
