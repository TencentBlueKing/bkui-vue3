<template>
  <div class="badge-demo">
    <bk-badge
      position="top-left"
      :count="999"
      theme="danger"
      :dot="true"
      style="margin-right: 40px"
    >
      <bk-button theme="primary">
        top-left
      </bk-button>
    </bk-badge>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  export default defineComponent({
    components: {},
  });
</script>
<style lang="less" scoped>
  .badge-demo {
    width: 90%;
    margin: 0 auto;
    padding: 30px;
  }
</style>
