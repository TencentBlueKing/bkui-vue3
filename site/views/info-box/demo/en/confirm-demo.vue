<template>
  <div>
    <bk-button
      type="primary"
      @click="handleDefault"
    >
      Direct use
    </bk-button>
    <bk-button
      style="margin-left: 15px"
      type="primary"
      @click="handleDefault2"
    >
      Update infoBox
    </bk-button>
  </div>
</template>

<script>
  import { InfoBox } from 'bkui-vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      const confirmInstance = InfoBox({
        isShow: false,
      });

      const handleDefault = () => {
        InfoBox({
          title: 'Are you sure you want to delete?',
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          dialogType: 'confirm',
          headerAlign: 'center',
          footerAlign: 'center',
          onConfirm() {
            return confirm('Are you sure you want to delete?');
          },
        });
      };

      const Confirm = (opts) => {
        confirmInstance.update(opts);
        confirmInstance.show(opts);
      };

      const handleDefault2 = () => {
        Confirm({
          title: 'Are you sure you want to delete?',
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          dialogType: 'confirm',
          headerAlign: 'center',
          footerAlign: 'center',
          onConfirm() {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(true);
              }, 100);
            });
          },
        });
      };

      return {
        confirmInstance,
        handleDefault,
        handleDefault2,
      };
    },
  });
</script>
