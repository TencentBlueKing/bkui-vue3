<template>
  <div>
    <bk-button @click="handleOpenSlider">
      Customize title and content
    </bk-button>
    <bk-sideslider
      v-model:isShow="isShow"
      :title="'I am custom title'"
      quick-close
    >
      <template #default>
        <div style="height: 1200px">
          I am custom content
        </div>
      </template>
    </bk-sideslider>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

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
