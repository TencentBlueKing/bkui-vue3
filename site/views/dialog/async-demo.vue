<template>
  <div>
    <bk-button
      @click="() => exampleSetting.dialog.isShow = true"
    >
      异步关闭
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting.dialog.isShow"
      :title="'文本标题'"
      :theme="'primary'"
      :button-loading="exampleSetting.dialog.loading"
      @closed="() => exampleSetting.dialog.isShow = false"
      @confirm="handleConfirm"
    >
      <div> 点击确定后 {{ exampleSetting.dialog.countdown }} 秒关闭</div>
    </bk-dialog>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  import BkButton from '@bkui-vue/button';
  import BkDialog from '@bkui-vue/dialog';

  export default defineComponent({
    name: 'SiteDialog',
    components: {
      BkButton,
      BkDialog,
    },
    setup() {
      const exampleSetting = ref({
        dialog: {
          isShow: false,
          loading: false,
          countdown: 3,
          timer: null,
        },
      });
      return { exampleSetting };
    },
    methods: {
      handleConfirm() {
        this.exampleSetting.dialog.loading = true;
        this.exampleSetting.dialog.timer = setInterval(() => {
          this.exampleSetting.dialog.countdown -= 1;
          if (this.exampleSetting.dialog.countdown === 0) {
            this.exampleSetting.dialog.isShow = false;
            this.exampleSetting.dialog.loading = false;
            this.exampleSetting.dialog.countdown = 3;
            clearInterval(this.exampleSetting.dialog.timer);
          }
        }, 1000);
      },
    },
  });
</script>

<style>

</style>
