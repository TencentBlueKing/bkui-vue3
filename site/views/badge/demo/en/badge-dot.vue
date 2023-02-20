<template>
  <div class="badge-demo">
    <bk-badge
      position="top-left"
      :count="999"
      theme="danger"
      dot
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
    padding: 30px;
    margin: 0 auto;
  }
</style>
