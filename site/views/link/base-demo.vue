<template>
  <div>
    <bk-link style="margin-right: 2px;">这是默认</bk-link>
    <bk-link style="margin-right: 2px;" theme="danger" @click="handleClick">这是危险</bk-link>
    <bk-link style="margin-right: 2px;" theme="warning">这是警告</bk-link>
    <bk-link style="margin-right: 2px;" theme="success">这是成功</bk-link>
    <bk-link style="margin-right: 2px;" theme="primary">这是主要</bk-link>
  </div>
</template>
<script setup>

  const handleClick = () => {
    console.log('handleClickhandleClickhandleClickhandleClick');
  };
</script>
