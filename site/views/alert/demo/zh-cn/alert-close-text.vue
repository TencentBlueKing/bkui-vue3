<template>
  <bk-alert
    theme="success"
    :title="'成功的提示文字'"
    :close-text="'继续努力'"
    closable
  />
  <bk-alert
    theme="info"
    :title="'消息的提示文字'"
    :close-text="'下次见！'"
    closable
  />
  <bk-alert
    theme="warning"
    :title="'警告的提示文字'"
    :close-text="'删掉'"
    closable
  />
</template>

<script>
  import { defineComponent } from 'vue';

  import BkAlert from '@bkui-vue/alert';
  export default defineComponent({
    components: {
      BkAlert,
    },
    setup() {
      return {};
    },
  });
</script>

<style lang="postcss">
.bk-alert ~ .bk-alert {
  margin-top: 20px;
}
</style>
