<template>
  <div>
    <bk-button
      type="primary"
      @click="handleSingle({delay: 10000})"
    >
      {{ t('10s 后关闭') }}
    </bk-button>&nbsp;&nbsp;
    <bk-button
      type="primary"
      @click="handleSingle({delay: 0})"
    >
      {{ t('不自动关闭') }}
    </bk-button>&nbsp;&nbsp;
    <bk-button
      type="primary"
      @click="handleSingle({dismissable: false})"
    >
      {{ t('不显示关闭 icon') }}
    </bk-button>
  </div>
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


      const handleSingle = (config)  => {
        const notifyConfig = {
          title: title.value,
          message: message.value,
          ...config,
        };
        Notify(notifyConfig);
      };

      return {
        handleSingle,
        t,
      };
    },
  });
</script>
