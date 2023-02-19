<template>
  <div>
    <p>
      <bk-button
        theme="danger"
        @click="handleSingle({ position: placement.topLeft, theme: 'error' })"
      >
        {{ t('左上角') }}
      </bk-button>&nbsp;&nbsp;
      <bk-button
        theme="success"
        @click="handleSingle({ position: placement.topRight, theme: 'success' })"
      >
        {{ t('右上角') }}
      </bk-button>
    </p>
    <p>
      <bk-button
        theme="warning"
        @click="handleSingle({ position: placement.bottomLeft, theme: 'warning' })"
      >
        {{ t('左下角') }}
      </bk-button>&nbsp;&nbsp;
      <bk-button
        theme="primary"
        @click="handleSingle({ position: placement.bottomRight, theme: 'primary' })"
      >
        {{ t('右下角') }}
      </bk-button>
    </p>
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

      const placement = ref({
        topLeft: 'top-left',
        topRight: 'top-right',
        bottomLeft: 'bottom-left',
        bottomRight: 'bottom-right',
      });

      const handleSingle = (config) => {
        config.title = title.value;
        config.message = message.value;
        Notify(config);
      };

      return {
        placement,
        handleSingle,
        t,
      };
    },
  });
</script>
