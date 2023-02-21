<template>
  <div>
    <bk-button
      theme="primary"
      @click="handleSingle({ theme: 'primary' })"
    >
      primary
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="success"
      @click="handleSingle({ theme: 'success' })"
    >
      success
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="warning"
      @click="handleSingle({ theme: 'warning' })"
    >
      warning
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="danger"
      @click="handleSingle({ theme: 'error' })"
    >
      fail
    </bk-button>
  </div>
</template>

<script>
  import { Notify } from 'bkui-vue';
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const title = ref('Hello! Welcome to use Blue Whale Smart Cloud products');
      const message = ref('Hello, the function permission you applied for has been opened. Please log in and check in time. If you have any questions, please contact the Blue Whale Smart Cloud administrator or follow the WeChat public account.');

      const handleSingle = (config) => {
        config.title = title.value;
        config.message = message.value;
        Notify(config);
      };

      return {
        handleSingle,
      };
    },
  });
</script>
