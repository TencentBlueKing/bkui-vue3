<template>
  <div>
    <bk-button @click="handleOpenSlider">
      {{ t('自定义标题和内容') }}
    </bk-button>
    <bk-sideslider
      v-model:isShow="isShow"
      :title="t('我是自定义标题')"
      quick-close
    >
      <template #default>
        <div style="height: 1200px;">
          {{ t('我是自定义内容') }}
        </div>
      </template>
    </bk-sideslider>
  </div>
</template>

<script>
  import  { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    name: 'SiteSideslider',
    setup() {
      const { t } = useI18n();

      const isShow = ref(false);

      const handleOpenSlider = () => {
        isShow.value = !isShow.value;
      };

      return {
        isShow,
        handleOpenSlider,
        t,
      };
    },
  });
</script>
