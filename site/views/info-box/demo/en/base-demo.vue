<template>
  <div>
    <bk-button
      theme="primary"
      @click="handleDefault1"
    >
      Prompt box 1 for default configuration
    </bk-button>
    <bk-button
      theme="primary"
      style="margin-left: 15px"
      @click="handleDefault2"
    >
      Prompt box 2 for default configuration
    </bk-button>
  </div>
</template>

<script>
  import { InfoBox } from 'bkui-vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      const handleDefault1 = () => {
        InfoBox({
          title: 'Are you sure you want to delete?',
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          confirmFn() {},
        });
      };

      const handleDefault2 = () => {
        InfoBox({
          title: 'Please confirm whether to reset',
          subTitle: 'To reset SecureKey, you need to modify the callback address field in templates',
          confirmText: 'Button 1',
          cancelText: 'Button 2',
          onConfirm() {},
        });
      };

      return {
        handleDefault1,
        handleDefault2,
      };
    },
  });
</script>
