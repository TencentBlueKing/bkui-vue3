<template>
  <div class="demo">
    <div :style="{ margin: '0 10px 30px 10px' }">
      <bk-slider
        v-model="demo1"
        :custom-content="customContent"
        show-tip
        :step="20"
      />
    </div>
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import BkSlider from '@bkui-vue/slider';

  export default defineComponent({
    name: 'SiteBkSlider',
    components: {
      BkSlider,
    },
    setup() {
      const { t } = useI18n();
      const demo1 = ref(20);
      const customContent = {
        0: {
          label: t('糟糕'),
        },
        20: {
          label: t('一般'),
        },
        40: {
          label: t('还行'),
          tip: t('还行勉勉强强'),
        },
        60: {
          label: t('满意'),
        },
        80: {
          label: t('很好'),
        },
        100: {
          label: t('非常满意'),
        },
      };
      return {
        demo1,
        customContent,
      };
    },
  });

</script>
<style scoped>
  .demo {
    width: 100%;
  }
</style>
