<template>
  <div class="badge-demo">
    <span style="position: relative">
      {{ news }}
      <bk-badge
        :count="2"
        theme="danger"
        style="margin-left: 5px"
      />
    </span>
    <span style="position: relative">
      <bk-badge
        dot
        theme="danger"
        style=" margin-right: 5px;margin-left: 40px"
      />
      {{ news }}
    </span>
  </div>
</template>

<script>
  import { defineComponent, shallowRef } from 'vue';

  export default defineComponent({
    setup() {
      const news = shallowRef('Unread message');
      return {
        news,
      };
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
