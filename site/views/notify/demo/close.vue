<template>
  <div>
    <bk-button
      type="primary"
      @click="handleSingle({delay: 10000})"
    >
      10s 后关闭
    </bk-button>&nbsp;&nbsp;
    <bk-button
      type="primary"
      @click="handleSingle({delay: 0})"
    >
      不自动关闭
    </bk-button>&nbsp;&nbsp;
    <bk-button
      type="primary"
      @click="handleSingle({dismissable: false})"
    >
      不显示关闭 icon
    </bk-button>
  </div>
</template>

<script>
  import BkNotify from '@bkui-vue/notify';

  export default {
    data() {
      return {
        title: '你好！欢迎你使用蓝鲸智云产品',
        message: '你好，你申请的功能权限现已开通，请及时登录查询。如有疑问，请与蓝鲸智云管理人员联系或关注微信公众账号。',
      };
    },
    methods: {
      handleSingle(config) {
        const notifyConfig = {
          title: this.title,
          message: this.message,
          ...config,
        };
        BkNotify(notifyConfig);
      },
    },
  };
</script>
