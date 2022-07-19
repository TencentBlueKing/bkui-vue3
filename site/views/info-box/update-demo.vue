<template>
  <div>
    <bk-button
      type="primary"
      @click="handleDefault"
    >
      默认配置的消息提示
    </bk-button>
    <bk-button
      style="margin-left: 15px;"
      type="primary"
      @click="handleDefault2"
    >
      默认配置的消息提示
    </bk-button>
  </div>
</template>

<script setup>
  import InfoBox from '@bkui-vue/info-box';
  const confirmA = InfoBox({
    title: '确认要删除1？',
    subTitle: '11111',
    isShow: false,
    onConfirm() {
      alert(2);
    },
  });
  const handleDefault = () => {
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
