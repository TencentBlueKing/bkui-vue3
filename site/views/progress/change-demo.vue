<template>
  <div style="width: 100%">
    <div class="mb10">
      <bk-progress :percent="percent" />
    </div>
    <bk-button
      type="primary"
      @click="changeRadius"
    >
      {{ value }}
    </bk-button>
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import BkButton from '@bkui-vue/button';
  import BkProgress from '@bkui-vue/progress';

  export default defineComponent({
    name: 'SiteProgress',
    components: {
      BkProgress,
      BkButton,
    },
    setup() {
      const { t } = useI18n();
      const percent = ref(0);
      const value = ref(t('改变值'));
      const changeRadius = () => {
        percent.value = Number(Math.random() * 100);
      };
      return {
        percent,
        value,
        changeRadius,
      };
    },
  });
</script>

<style scoped>
.mb10 {
  margin-bottom: 10px;
}
</style>
