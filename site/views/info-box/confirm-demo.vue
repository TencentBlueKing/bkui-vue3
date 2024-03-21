<template>
  <div>
    <bk-button
      type="primary"
      @click="handleDefault"
    >
      直接使用
    </bk-button>
  </div>
</template>

<script setup>
  import InfoBox from '@bkui-vue/info-box';

  const handleDefault = () => {
    InfoBox({
      title: '确认要删除1？',
      subTitle: '确认要删除？',
      dialogType: 'confirm',
      headerAlign: 'center',
      footerAlign: 'center',
    });
  };
</script>
