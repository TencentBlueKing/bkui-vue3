<template>
  <div>
    <bk-button @click="handleOpenSlider">
      Custom footer
    </bk-button>
    <bk-sideslider
      v-model:isShow="isShow"
      :title="'I am custom title'"
      quick-close
    >
      <template #default>
        <div :style="{ height: `${contentHeight}px` }" />
      </template>
      <template #footer>
        <div class="footer-content">
          <bk-button
            theme="primary"
            @click="contentHeight = 1000"
          >
            Set content height 1000px
          </bk-button>
          <bk-button
            style="margin-left: 10px"
            @click="contentHeight = 400"
          >
            Set content height 400px
          </bk-button>
        </div>
      </template>
    </bk-sideslider>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    name: 'SiteSideslider',
    setup() {
      const isShow = ref(false);
      const contentHeight = ref(400);

      const handleOpenSlider = () => {
        isShow.value = !isShow.value;
      };

      return {
        isShow,
        contentHeight,
        handleOpenSlider,
      };
    },
  });
</script>

<style>
.footer-content {
  display: flex;
  padding: 0 10px;
}
</style>
