<template>
  <div class="badge-demo">
    <bk-badge style="margin-right: 40px">
      <bk-button theme="primary">
        top-right
      </bk-button>
      <template #icon>
        <help />
      </template>
    </bk-badge>
    <bk-badge
      position="bottom-left"
      :count="999"
      theme="success"
      style="margin-right: 40px"
    >
      <bk-button theme="primary">
        bottom-left
      </bk-button>
    </bk-badge>
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
    <bk-badge
      position="bottom-right"
      :count="'数字字符串'"
      :radius="'0px'"
      theme="warning"
      style="margin-right: 40px"
    >
      <bk-button theme="primary">
        bottom-right
      </bk-button>
    </bk-badge>
  </div>
</template>

<script>
  import { Help } from 'bkui-vue/lib/icon';
  import { defineComponent } from 'vue';
  export default defineComponent({
    components: {
      Help,
    },
  });
</script>
<style lang="less" scoped>
  .badge-demo {
    width: 90%;
    padding: 30px;
    margin: 0 auto;
  }
</style>
