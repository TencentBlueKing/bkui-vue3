<template>
  <div>
    <bk-button
      @click="() => exampleSetting.dialog.isShow = true"
    >
      全屏弹框
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting.dialog.isShow"
      :title="'全屏弹框标题'"
      :theme="'primary'"
      :header-align="'center'"
      fullscreen
      @closed="() => exampleSetting.dialog.isShow = false"
      @confirm="() => exampleSetting.dialog.isShow = false"
    >
      <p>【首部及导言】</p>
      <p>欢迎您使用腾讯蓝鲸智云软件及服务。</p>
      <p>
        为使用腾讯蓝鲸智云软件（以下简称本软件）及服务，您应当阅读并遵守《腾讯蓝鲸智云软件许可及服务协议》
        （以下简称本协议），以及《腾讯服务协议》。
        请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款，以及开通或使用某项服务的单独协议，
        并选择接受或不接受。限制、免责条款可能以加粗形式提示您注意。
      </p>
      <p>
        除非您已阅读并接受本协议所有条款，否则您无权下载、安装或使用本软件及相关服务。
        您的下载、安装、使用、登录等行为即视为您已阅读并同意上述协议的约束。
      </p>
      <p>一、【协议的范围】</p>
      <p>1.1【协议适用主体范围】</p>
      <p>本协议是您与腾讯之间关于您下载、安装、使用、复制本软件，以及使用腾讯相关服务所订立的协议。</p>
      <p>1.2【协议关系及冲突条款】</p>
      <p>
        本协议被视为《腾讯服务协议》（链接地址:http://www.qq.com/contract.shtml，若链接地址变更的，
        则以变更后的链接地址所对应的内容为准；其他链接地址变更的情形，均适用前述约定。）的补充协议，
        是其不可分割的组成部分是其不可分割的组成部分。
      </p>
      <p>【首部及导言】</p>
      <p>欢迎您使用腾讯蓝鲸智云软件及服务。</p>
      <p>
        为使用腾讯蓝鲸智云软件（以下简称本软件）及服务，您应当阅读并遵守《腾讯蓝鲸智云软件许可及服务协议》
        （以下简称本协议），以及《腾讯服务协议》。请您务必审慎阅读、充分理解各条款内容，
        特别是免除或者限制责任的条款，以及开通或使用某项服务的单独协议，并选择接受或不接受。
        限制、免责条款可能以加粗形式提示您注意。
      </p>
      <p>
        除非您已阅读并接受本协议所有条款，否则您无权下载、安装或使用本软件及相关服务。您的下载、安装、使用、
        登录等行为即视为您已阅读并同意上述协议的约束。
      </p>
      <p>一、【协议的范围】</p>

      <p>1.1【协议适用主体范围】</p>
      <p>本协议是您与腾讯之间关于您下载、安装、使用、复制本软件，以及使用腾讯相关服务所订立的协议。</p>
      <p>1.2【协议关系及冲突条款】</p>
    </bk-dialog>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  import BkButton from '@bkui-vue/button';
  import BkDialog from '@bkui-vue/dialog';

  const exampleSetting = ref({
    dialog: {
      isShow: false,
    },
  });
</script>
