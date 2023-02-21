<template>
  <bk-button
    type="primary"
    @click="handleDefault"
  >
    Message prompt for default configuration
  </bk-button>
</template>

<script>
  import { Message } from 'bkui-vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      const handleDefault = () => {
        Message('Select the build machine you imported and fill in the relevant information. The system will install the necessary software for you');
      };

      return {
        handleDefault,
      };
    },
  });
</script>
