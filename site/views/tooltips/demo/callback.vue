<template>
  <span
    v-bk-tooltips="config"
    class="bk-tooltips-base"
  >
    <info />
  </span>
</template>

<script>
  import { defineComponent } from 'vue';

  import { bkTooltips } from '@bkui-vue/directives';
  import { Info } from '@bkui-vue/icon';
  import BkMessage from '@bkui-vue/message';

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
          BkMessage({
            theme: 'success',
            message: 'onShow',
          });
        },
        onHide: () => {
          BkMessage({
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
