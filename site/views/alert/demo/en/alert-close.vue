<template>
  <bk-alert
    theme="success"
    :title="'Prompt text for success'"
    closable
  />
  <bk-alert
    theme="info"
    :title="'Prompt text of message'"
    closable
  />
  <bk-alert
    theme="warning"
    :title="'Warning prompt text'"
    closable
  />
  <bk-alert
    theme="error"
    :title="'Wrong prompt text'"
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
