<template>
  <div>
    <bk-button @click="handleOpenSlider">
      Default configuration
    </bk-button>
    <bk-sideslider
      v-model:isShow="isShow"
      :title="'I am the title'"
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
