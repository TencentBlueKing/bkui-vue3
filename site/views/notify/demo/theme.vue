<template>
  <div>
    <bk-button
      theme="primary"
      @click="handleSingle({ theme: 'primary' })"
    >
      {{ t('消息') }}
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="success"
      @click="handleSingle({ theme: 'success' })"
    >
      {{ t('成功') }}
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="warning"
      @click="handleSingle({ theme: 'warning' })"
    >
      {{ t('警告') }}
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="danger"
      @click="handleSingle({ theme: 'error' })"
    >
      {{ t('失败') }}
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

      const handleSingle = (config) => {
        config.title = title.value;
        config.message = message.value;
        Notify(config);
      };

      return {
        handleSingle,
        t,
      };
    },
  });
</script>
