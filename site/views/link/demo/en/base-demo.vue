<template>
  <div>
    <bk-link>This is the default</bk-link>
    <bk-link
      theme="danger"
      @click="handleClick"
    >
      This is the default
    </bk-link>
    <bk-link theme="warning">
      This is a warning
    </bk-link>
    <bk-link theme="success">
      This is success
    </bk-link>
    <bk-link theme="primary">
      This is the primary
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
