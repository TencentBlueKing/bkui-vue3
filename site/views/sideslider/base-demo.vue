<template>
  <div>
    <bk-button @click="handleOpenSlider">
      {{ t('默认配置') }}
    </bk-button>
    <bk-sideslider
      v-model:isShow="isShow"
      :title="t('我是标题')"
      quick-close
    />
  </div>
</template>

<script>
  import  { defineComponent, ref  } from 'vue';
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
