<template>
  <div>
    <bk-button
      theme="primary"
      @click="handleDefault"
    >
      点击删除(成功)
    </bk-button>
    <bk-button
      style="margin-left: 15px"
      theme="primary"
      @click="handleDefault2"
    >
      点击删除(失败)
    </bk-button>
  </div>
</template>

<script>
  import { InfoBox } from 'bkui-vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      const confirmA = InfoBox({
        title: '确认要删除？',
        confirmText: '确定',
        cancelText: '取消',
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
          title: '确认要删除？',
          subTitle: '22222',
          confirmText: '确定',
          cancelText: '取消',
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
