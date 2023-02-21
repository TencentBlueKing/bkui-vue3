<template>
  <div>
    <bk-button
      theme="primary"
      @click="handlePrimary"
    >
      primary
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="success"
      @click="handleSuccess"
    >
      success
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="warning"
      @click="handleWarning"
    >
      warning
    </bk-button>&nbsp;&nbsp;
    <bk-button
      theme="danger"
      @click="handleError"
    >
      fail
    </bk-button>
  </div>
</template>

<script>
  import { Message } from 'bkui-vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      const handlePrimary = () => {
        Message({
          theme: 'primary',
          message:
            'Select the build machine you imported and fill in the relevant information. The system will install the necessary software for you',
        });
      };

      const handleSuccess = () => {
        Message({
          theme: 'success',
          message:
            'congratulations! The application you submitted has been approved. Please follow up and understand the next operation method in time',
        });
      };

      const handleWarning = () => {
        Message({
          theme: 'warning',
          message:
            'The system will be upgraded from 19:00-21:00. Please save your data in time',
        });
      };

      const handleError = () => {
        Message({
          theme: 'error',
          message: 'System error, please try again later',
        });
      };

      return {
        handlePrimary,
        handleSuccess,
        handleWarning,
        handleError,
      };
    },
  });
</script>
