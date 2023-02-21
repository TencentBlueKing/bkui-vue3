<template>
  <bk-alert
    theme="success"
    :title="'Prompt text for success'"
    :close-text="'keep trying'"
    closable
  />
  <bk-alert
    theme="info"
    :title="'Prompt text of message'"
    :close-text="'See you next time!'"
    closable
  />
  <bk-alert
    theme="warning"
    :title="'Warning prompt text'"
    :close-text="'Delete'"
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
