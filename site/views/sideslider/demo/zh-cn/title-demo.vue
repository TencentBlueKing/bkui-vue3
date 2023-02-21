<template>
  <div>
    <bk-button @click="handleOpenSlider">
      自定义标题和内容
    </bk-button>
    <bk-sideslider
      v-model:isShow="isShow"
      :title="'我是自定义标题'"
      quick-close
    >
      <template #default>
        <div style="height: 1200px">
          我是自定义内容
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
