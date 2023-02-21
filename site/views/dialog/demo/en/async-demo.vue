<template>
  <div>
    <bk-button
      @click="() => exampleSetting.isShow = true"
    >
      Asynchronous shutdown
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting.isShow"
      :title="'Text Title'"
      :theme="'primary'"
      :confirm-text="exampleSetting.confirmText"
      :cancel-text="exampleSetting.cancelText"
      :is-loading="exampleSetting.loading"
      @closed="() => exampleSetting.isShow = false"
      @confirm="handleConfirm"
    >
      <div>After clicking OK {{ exampleSetting.countdown }} Seconds off</div>
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
        isShow: false,
        loading: false,
        countdown: 3,
        timer: null,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
      });

      const handleConfirm = () => {
        exampleSetting.value.loading = true;
        exampleSetting.value.timer = setInterval(() => {
          exampleSetting.value.countdown -= 1;
          if (exampleSetting.value.countdown === 0) {
            exampleSetting.value.isShow = false;
            exampleSetting.value.loading = false;
            exampleSetting.value.confirmText = 'Confirm';
            exampleSetting.value.countdown = 3;
            clearInterval(exampleSetting.value.timer);
          }
        }, 1000);
      };

      return {
        exampleSetting,
        handleConfirm,
      };
    },
  });
</script>

