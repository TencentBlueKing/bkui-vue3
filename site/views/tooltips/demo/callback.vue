<template>
  <span
    v-bk-tooltips="config"
    class="bk-tooltips-base"
  >
    <info />
  </span>
</template>

<script>
  import { bkTooltips, Message } from 'bkui-vue';
  import { Info } from 'bkui-vue/lib/icon';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: {
      Info,
    },
    directives: {
      bkTooltips,
    },
    setup() {
      const config = {
        content: '提示信息',
        onShow: () => {
          Message({
            theme: 'success',
            message: 'onShow',
          });
        },
        onHide: () => {
          Message({
            theme: 'error',
            message: 'onHide',
          });
        },
      };
      return {
        config,
      };
    },
  });
</script>

<style lang="postcss">
.bk-tooltips-base {
  font-size: 18px;
  color: #3a84ff;
  cursor: pointer;
}
</style>
