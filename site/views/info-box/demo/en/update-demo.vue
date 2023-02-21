<template>
  <div>
    <bk-button
      theme="primary"
      @click="handleDefault"
    >
      Click Delete (successful)
    </bk-button>
    <bk-button
      style="margin-left: 15px"
      theme="primary"
      @click="handleDefault2"
    >
      Click Delete (failed)
    </bk-button>
  </div>
</template>

<script>
  import { InfoBox } from 'bkui-vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      const confirmA = InfoBox({
        title: 'Are you sure you want to delete?',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        isShow: false,
        headerAlign: 'center',
        footerAlign: 'center',
        isLoading: false,
        onConfirm() {},
      });

      const handleDefault = () => {
        confirmA.show();
      };

      const handleDefault2 = () => {
        confirmA.update({
          title: 'Are you sure you want to delete?',
          subTitle: '22222',
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          onConfirm() {
            console.log('22');
          },
        });
        confirmA.show();
      };

      return {
        confirmA,
        handleDefault,
        handleDefault2,
      };
    },
  });
</script>
