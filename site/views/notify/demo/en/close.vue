<template>
  <div>
    <bk-button
      type="primary"
      @click="handleSingle({ delay: 10000 })"
    >
      Close after 10s
    </bk-button>&nbsp;&nbsp;
    <bk-button
      type="primary"
      @click="handleSingle({ delay: 0 })"
    >
      Do not close automatically
    </bk-button>&nbsp;&nbsp;
    <bk-button
      type="primary"
      @click="handleSingle({ dismissable: false })"
    >
      Do not display the closing icon
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
        const notifyConfig = {
          title: title.value,
          message: message.value,
          ...config,
        };
        Notify(notifyConfig);
      };

      return {
        handleSingle,
      };
    },
  });
</script>
