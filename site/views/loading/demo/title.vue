<template>
  <div>
    <bk-loading
      loading
      :title="loadingText"
    >
      <div class="loading-title-container">
        Content
      </div>
    </bk-loading>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const loadingText = ref(t('数据加载中'));

      return {
        loadingText,
      };
    },
  });
</script>

<style lang="postcss">
.loading-title-container {
  display: flex;
  width: 100%;
  height: 360px;
  align-items: center;
  justify-content: center;
}
</style>
