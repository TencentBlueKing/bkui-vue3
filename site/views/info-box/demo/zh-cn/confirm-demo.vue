<template>
  <div>
    <bk-button
      type="primary"
      @click="handleDefault"
    >
      直接使用
    </bk-button>
    <bk-button
      style="margin-left: 15px"
      type="primary"
      @click="handleDefault2"
    >
      更新infoBox
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
          title: '确认要删除？',
          confirmText: '确认',
          cancelText: '取消',
          dialogType: 'confirm',
          headerAlign: 'center',
          footerAlign: 'center',
          onConfirm() {
            return confirm('确认要删除？');
          },
        });
      };

      const Confirm = (opts) => {
        confirmInstance.update(opts);
        confirmInstance.show(opts);
      };

      const handleDefault2 = () => {
        Confirm({
          title: '确认要删除？',
          confirmText: '确认',
          cancelText: '取消',
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
