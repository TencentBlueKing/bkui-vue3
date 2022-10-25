<template>
  <div>
    <p>
      <bk-button
        theme="danger"
        @click="handleSingle({position: placement.topLeft, theme: 'error'})"
      >
        左上角
      </bk-button>&nbsp;&nbsp;
      <bk-button
        theme="success"
        @click="handleSingle({position: placement.topRight, theme: 'success'})"
      >
        右上角
      </bk-button>
    </p>
    <p>
      <bk-button
        theme="warning"
        @click="handleSingle({position: placement.bottomLeft, theme: 'warning'})"
      >
        左下角
      </bk-button>&nbsp;&nbsp;
      <bk-button
        theme="primary"
        @click="handleSingle({position: placement.bottomRight, theme: 'primary'})"
      >
        右下角
      </bk-button>
    </p>
  </div>
</template>

<script setup>
  import { Notify } from 'bkui-vue';
  import { ref } from 'vue';

  const title = ref('你好！欢迎你使用蓝鲸智云产品');
  const message = ref('你好，你申请的功能权限现已开通，请及时登录查询。如有疑问，请与蓝鲸智云管理人员联系或关注微信公众账号。');
  const placement = ref({
    topLeft: 'top-left',
    topRight: 'top-right',
    bottomLeft: 'bottom-left',
    bottomRight: 'bottom-right',
  });

  function handleSingle(config) {
    config.title = title.value;
    config.message = message.value;
    Notify(config);
  }
</script>
