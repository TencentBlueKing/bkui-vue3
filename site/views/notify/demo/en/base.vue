<template>
  <bk-button
    type="primary"
    @click="handleDefault"
  >
    Default configured notification prompt
  </bk-button>&nbsp;&nbsp;
  <bk-button
    type="primary"
    @click="handleHideTitle"
  >
    No title by default
  </bk-button>
</template>

<script>
  import { Notify } from 'bkui-vue';
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const title = ref('Hello! Welcome to use Blue Whale Smart Cloud products');
      const message = ref('Hello, the function permission you applied for has been opened. Please log in and check in time. If you have any questions, please contact the Blue Whale Smart Cloud administrator or follow the WeChat public account.');

      const handleDefault = () => {
        Notify({
          title: title.value,
          message: message.value,
        });
      };

      const handleHideTitle = () => {
        Notify({
          message: message.value,
        });
      };

      return {
        handleDefault,
        handleHideTitle,
      };
    },
  });
</script>
