<template>
  <div style="width: 100%">
    <div>
      <bk-progress
        :text-inside="false"
        type="dashboard"
        :percent="30"
        bg-color="#3a84ff"
        color="#f56c6c"
      >
        <span>{{ t("未开始") }}</span>
      </bk-progress>
      <bk-progress
        text-inside
        type="circle"
        :percent="10"
        color="#f56c6c"
      />
    </div>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  import BkProgress from '@bkui-vue/progress';

  export default defineComponent({
    name: 'SiteProgress',
    components: {
      BkProgress,
    },
    setup() {
      const { t } = useI18n();
      return {
        t,
      };
    },
  });
</script>

<style scoped>
.mb10 {
  margin-bottom: 10px;
}

.bk-progress {
  margin-right: 30px;
}
</style>
