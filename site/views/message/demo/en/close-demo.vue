<template>
  <div>
    <bk-button
      type="primary"
      @click="handleSingle({ delay: 10000 })"
    >
      <span>Close after 10s</span>
    </bk-button>&nbsp;&nbsp;
    <bk-button
      type="primary"
      @click="handleSingle({ delay: 0 })"
    >
      <span>Do not close automatically</span>
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
  import { Message } from 'bkui-vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      const handleSingle = (config) => {
        const messageConfig = {
          message:
            'Select the builder you imported and fill in the relevant information. The system will install the necessary software for you',
          ...config,
        };
        Message(messageConfig);
      };

      return {
        handleSingle,
      };
    },
  });
</script>
