<template>
  <div>
    <bk-link disabled>
      这是默认
    </bk-link>
    <bk-link
      disabled
      theme="danger"
    >
      这是危险
    </bk-link>
    <bk-link
      disabled
      theme="warning"
    >
      这是警告
    </bk-link>
    <bk-link
      disabled
      underline
      theme="success"
    >
      这是成功
    </bk-link>
    <bk-link
      disabled
      underline
      theme="primary"
    >
      这是主要
    </bk-link>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {},
  });
</script>

<style lang="postcss" scoped>
.bk-link {
  margin-right: 10px;
}
</style>
