<template>
  <div>
    <bk-button @click="handleOpenSlider">
      自定义footer
    </bk-button>
    <bk-sideslider
      v-model:isShow="isShow"
      title="我是自定义标题"
      quick-close
    >
      <template #default>
        <div :style="{height: `${contentHeight}px`}" />
      </template>
      <template #footer>
        <div style="padding-left: 24px;">
          <bk-button
            theme="primary"
            @click="contentHeight = 1000"
          >
            设置内容高度1000px
          </bk-button>
          <bk-button
            style="margin-left: 8px;"
            @click="contentHeight = 400"
          >
            设置内容高度400px
          </bk-button>
        </div>
      </template>
    </bk-sideslider>
  </div>
</template>

<script lang="ts">
  import  { defineComponent, ref } from 'vue';
  export default defineComponent({
    name: 'SiteSideslider',
    setup() {
      const isShow = ref(false);
      const contentHeight = ref(400);
      const handleOpenSlider = () => {
        isShow.value = !isShow.value;
      };
      return {
        handleOpenSlider,
        contentHeight,
        isShow,
      };
    },
  });
</script>
