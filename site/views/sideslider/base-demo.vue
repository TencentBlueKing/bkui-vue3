<template>
  <div>
    <bk-button @click="handleOpenSlider">
      默认配置
    </bk-button>
    <bk-sideslider
      v-model:isShow="isShow"
      title="我是标题"
      quick-close
      :before-close="beforeClose"
      transfer
    />
  </div>
</template>

<script>
  import { InfoBox } from 'bkui-vue';
  import  { defineComponent, ref  } from 'vue';
  export default defineComponent({
    name: 'SiteSideslider',
    setup() {
      const isShow = ref(false);
      const handleOpenSlider = () => {
        isShow.value = !isShow.value;
      };
      const beforeClose = () => {
        console.log('beforeClose---000');
        InfoBox({
          title: '确认关闭？',
          infoType: 'warning',
          onConfirm: () => {
            isShow.value = false;
            return Promise.resolve(true);
          },
        });
      };
      return {
        handleOpenSlider,
        beforeClose,
        isShow,
      };
    },
  });
</script>
