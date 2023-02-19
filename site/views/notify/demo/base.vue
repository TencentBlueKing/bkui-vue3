<template>
  <bk-button
    type="primary"
    @click="handleDefault"
  >
    {{ t('默认配置的通知提示') }}
  </bk-button>&nbsp;&nbsp;
  <bk-button
    type="primary"
    @click="handleHideTitle"
  >
    {{ t('默认没有标题') }}
  </bk-button>
</template>

<script>
  import { Notify } from 'bkui-vue';
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const title = ref(t('你好！欢迎你使用蓝鲸智云产品'));
      const message = ref(t('你好，你申请的功能权限现已开通，请及时登录查询。如有疑问，请与蓝鲸智云管理人员联系或关注微信公众账号。'));

      const handleDefault = () => {
        Notify({
          title: title.value,
          message: message.value,
        });
      };

      const handleHideTitle = () => {
        Notify({
          message: message.value,
        });
      };

      return {
        handleDefault,
        handleHideTitle,
        t,
      };
    },
  });
</script>
