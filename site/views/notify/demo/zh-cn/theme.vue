<template>
  <div>
    <bk-button
      theme="primary"
      @click="handleSingle({ theme: 'primary' })"
    >
      主要的
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="success"
      @click="handleSingle({ theme: 'success' })"
    >
      成功
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="warning"
      @click="handleSingle({ theme: 'warning' })"
    >
      警告
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="danger"
      @click="handleSingle({ theme: 'error' })"
    >
      失败
    </bk-button>
  </div>
</template>

<script>
  import { Notify } from 'bkui-vue';
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const title = ref('你好！欢迎你使用蓝鲸智云产品');
      const message = ref('你好，你申请的功能权限现已开通，请及时登录查询。如有疑问，请与蓝鲸智云管理人员联系或关注微信公众账号。');

      const handleSingle = (config) => {
        config.title = title.value;
        config.message = message.value;
        Notify(config);
      };

      return {
        handleSingle,
      };
    },
  });
</script>
