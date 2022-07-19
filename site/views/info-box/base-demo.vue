<template>
  <div>
    <bk-button
      type="primary"
      @click="handleDefault"
    >
      默认配置的提示框
    </bk-button>
  </div>
</template>

<script setup>

  import InfoBox from '@bkui-vue/info-box';
  const handleDefault = () => {
    InfoBox({
      title: '确认要删除1？',
      onConfirm() {
        alert(2);
      },
    });
  };
</script>
