<template>
  <div>
    <bk-button
      theme="success"
      @click="handleDefault1"
    >
      成功
    </bk-button>

    <bk-button
      theme="danger"
      class="ml10"
      @click="handleDefault2"
    >
      错误
    </bk-button>

    <bk-button
      theme="warning"
      class="ml10"
      @click="handleDefault3"
    >
      警告
    </bk-button>

    <bk-button
      class="ml10"
      @click="handleDefault4"
    >
      loading
    </bk-button>
  </div>
</template>

<script setup>

  import InfoBox from '@bkui-vue/info-box';
  const handleDefault1 = () => {
    InfoBox({
      infoType: 'success',
      title: '添加用户成功',
      headerAlign: 'center',
      footerAlign: 'center',
      onConfirm() {},
    });
  };

  const handleDefault2 = () => {
    InfoBox({
      infoType: 'danger',
      title: '添加用户失败',
      headerAlign: 'center',
      footerAlign: 'center',
      onConfirm() {},
    });
  };

  const handleDefault3 = () => {
    InfoBox({
      infoType: 'warning',
      title: '此操作存在安全风险',
      headerAlign: 'center',
      footerAlign: 'center',
      isLoading: false,
      onConfirm() {},
    });
  };

  const handleDefault4 = () => {
    InfoBox({
      infoType: 'loading',
      title: 'loding',
      subTitle: '请稍等',
      headerAlign: 'center',
      footerAlign: 'center',
      onConfirm() {},
    });
  };
</script>
