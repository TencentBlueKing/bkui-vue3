<template>
  <div
    id="affix-demo"
    class="scrollable-container"
  >
    <div class="background">
      <bk-affix :target="'#affix-demo'">
        <bk-button theme="primary">
          固定在target容器顶部位置
        </bk-button>
      </bk-affix>
    </div>
  </div>
</template>
<script setup>
</script>
<style>
  #affix-demo.scrollable-container {
    height: 100px;
    overflow-y: scroll;
  }

  #affix-demo .background {
    height: 300px;
    padding-top: 60px;
    overflow: auto;
    background-color: #8f8f89;
  }
</style>
