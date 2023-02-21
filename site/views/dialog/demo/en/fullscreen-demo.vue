<template>
  <div>
    <bk-button @click="() => (exampleSetting.dialog.isShow = true)">
      Full-screen dialog
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting.dialog.isShow"
      :title="'Full-screen dialog title'"
      :theme="'primary'"
      :header-align="'center'"
      fullscreen
      @closed="() => (exampleSetting.dialog.isShow = false)"
      @confirm="() => (exampleSetting.dialog.isShow = false)"
    >
      <p>[First part and introduction]</p>
      <p>[Welcome to Tencent Blue Whale Smart Cloud software and services.]</p>
      <p>
        <span>
          In order to use Tencent Blue Whale Smart Cloud Software (hereinafter referred to
          as the Software) and services, you should read and abide by Tencent Blue Whale
          Smart Cloud Software License and Service Agreement (hereinafter referred to as
          the Agreement) and Tencent Service Agreement.
        </span>
        <span>
          (hereinafter referred to as the Agreement), and Tencent Service Agreement.
          Please carefully read and fully understand the contents of each clause,
          especially the clause of exemption or limitation of liability, as well as the
          separate agreement for opening or using a certain service, And choose to accept
          or not. Limitations and exclusions may remind you in bold form.
        </span>
      </p>
      <p>
        <span>Unless you have read and accepted all the terms of this agreement, you have no
          right to download, install or use the software and related services.</span>
        <span>Your download, installation, use, login and other actions are deemed to be that
          you have read and agreed to the above agreement.</span>
      </p>
      <p>1、 [Scope of Agreement]</p>
      <p>1.1 [Scope of applicable subjects of the agreement]</p>
      <p>
        This agreement is the agreement between you and Tencent regarding your download,
        installation, use, copy of the software and use of Tencent related services.
      </p>
      <p>1.2 [Agreement relationship and conflict clauses]</p>
      <p>
        <span>
          This agreement is regarded as Tencent Service Agreement (link address:
          http://www.qq.com/contract.shtml If the link address is changed, Then the
          content corresponding to the changed link address shall prevail; In other cases
          where the link address is changed, the above agreement shall apply.)
          Supplementary agreement,
        </span>
        <span>It is an integral part of it.</span>
      </p>
      <p>[First part and introduction]</p>
      <p>Welcome to use Tencent Blue Whale Smart Cloud software and services.</p>
      <p>
        <span>In order to use Tencent Blue Whale Smart Cloud Software (hereinafter referred
          to as the Software) and services, you should read and abide by the Tencent Blue
          Whale Smart Cloud Software License and Service Agreement</span>
        <span>Hereinafter referred to as the Agreement), and Tencent Service Agreement.
          Please read carefully and fully understand the contents of each clause,</span>
        <span>In particular, the terms of exemption or limitation of liability, as well as
          the separate agreement for opening or using a certain service, and choose to
          accept or not to accept.</span>
        <span>Limitations and exclusions may remind you in bold form.</span>
      </p>
      <p>
        <span>Unless you have read and accepted all the terms of this agreement, you have no
          right to download, install or use the software and related services. Your
          download, installation, use, login and other actions are deemed to be that you
          have read and agreed to the above agreement.</span>
      </p>
      <p>1、 [Scope of Agreement]</p>
      <p>1.1 [Scope of applicable subjects of the agreement]</p>
      <p>
        This agreement is the agreement between you and Tencent regarding your download,
        installation, use, copy of the software and use of Tencent related services.
      </p>
      <p>1.2 [Agreement relationship and conflict clauses]</p>
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
        dialog: {
          isShow: false,
        },
      });

      return {
        exampleSetting,
      };
    },
  });
</script>
