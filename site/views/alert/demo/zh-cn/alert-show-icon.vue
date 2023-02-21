<template>
  <bk-alert
    theme="success"
    :title="'成功的提示文字'"
    :show-icon="false"
  />
  <bk-alert
    theme="info"
    :title="'消息的提示文字'"
    :show-icon="false"
  />
  <bk-alert
    theme="warning"
    :title="'警告的提示文字'"
    :show-icon="false"
  />
  <bk-alert
    theme="error"
    :title="'错误的提示文字'"
    :show-icon="false"
  />
</template>

<script>
  import BkAlert from 'bkui-vue/alert';
  import { defineComponent } from 'vue';
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
