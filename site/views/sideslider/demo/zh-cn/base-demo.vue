<template>
  <div>
    <bk-button @click="handleOpenSlider">
      默认配置
    </bk-button>
    <bk-sideslider
      v-model:isShow="isShow"
      :title="'我是标题'"
      quick-close
    />
  </div>
</template>

<script>
  import  { defineComponent, ref  } from 'vue';

  export default defineComponent({
    name: 'SiteSideslider',
    setup() {
      const isShow = ref(false);

      const handleOpenSlider = () => {
        isShow.value = !isShow.value;
      };

      return {
        isShow,
        handleOpenSlider,
      };
    },
  });
</script>
