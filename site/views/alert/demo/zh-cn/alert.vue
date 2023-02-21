<template>
  <bk-alert
    theme="success"
    :title="'成功的提示文字'"
  />
  <bk-alert
    theme="info"
    :title="'消息的提示文字'"
  />
  <bk-alert
    theme="warning"
    :title="'警告的提示文字'"
  />
  <bk-alert
    theme="error"
    :title="'错误的提示文字'"
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
