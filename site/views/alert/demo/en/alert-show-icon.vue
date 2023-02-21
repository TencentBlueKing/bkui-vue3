<template>
  <bk-alert
    theme="success"
    :title="'Prompt text for success'"
    :show-icon="false"
  />
  <bk-alert
    theme="info"
    :title="'Prompt text of message'"
    :show-icon="false"
  />
  <bk-alert
    theme="warning"
    :title="'Warning prompt text'"
    :show-icon="false"
  />
  <bk-alert
    theme="error"
    :title="'Wrong prompt text'"
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
