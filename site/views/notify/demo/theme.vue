<template>
  <div>
    <bk-button
      theme="primary"
      @click="handleSingle({theme: 'primary'})"
    >
      消息
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="success"
      @click="handleSingle({theme: 'success'})"
    >
      成功
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="warning"
      @click="handleSingle({theme: 'warning'})"
    >
      警告
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="danger"
      @click="handleSingle({theme: 'error'})"
    >
      失败
    </bk-button>
  </div>
</template>

<script setup>
  import { Notify } from 'bkui-vue';
  import { ref } from 'vue';

  const title = ref('你好！欢迎你使用蓝鲸智云产品');
  const message = ref('你好，你申请的功能权限现已开通，请及时登录查询。如有疑问，请与蓝鲸智云管理人员联系或关注微信公众账号。');

  function handleSingle(config) {
    config.title = title.value;
    config.message = message.value;
    Notify(config);
  }
</script>
