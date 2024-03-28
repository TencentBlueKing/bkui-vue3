<template>
  <div>
    <bk-button
      theme="primary"
      @click="handleDefault"
    >
      点击删除(成功)
    </bk-button>
    <bk-button
      style="margin-left: 15px;"
      theme="primary"
      @click="handleDefault2"
    >
      点击删除(失败)
    </bk-button>
  </div>
</template>

<script setup>
  import InfoBox from '@bkui-vue/info-box';
  const confirmA = InfoBox({
    title: '确认要删除1？',
    isShow: false,
    headerAlign: 'center',
    footerAlign: 'center',
    isLoading: false,
    onConfirm() {},
  });
  const handleDefault = () => {
    confirmA.update({
      title: '确认要删除1？',
      subTitle: '1111',
      onConfirm() {
        console.log('11');
      },
    });
    confirmA.show();
  };
  const  handleDefault2 = () => {
    confirmA.update({
      title: '确认要删除2？',
      subTitle: '22222',
      onConfirm() {
        console.log('22');
      },
    });
    confirmA.show();
  };
</script>
