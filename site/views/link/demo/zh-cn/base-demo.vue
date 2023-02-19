<template>
  <div>
    <bk-link>这是默认</bk-link>
    <bk-link
      theme="danger"
      @click="handleClick"
    >
      这是默认
    </bk-link>
    <bk-link theme="warning">
      这是警告
    </bk-link>
    <bk-link theme="success">
      这是成功
    </bk-link>
    <bk-link theme="primary">
      这是主要
    </bk-link>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      const handleClick = () => {
        console.error('handleClickhandleClickhandleClickhandleClick');
      };

      return {
        handleClick,
      };
    },
  });
</script>

<style lang="postcss" scoped>
.bk-link {
  margin-right: 10px;
}
</style>
