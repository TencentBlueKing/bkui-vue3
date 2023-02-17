<template>
  <div>
    <bk-tag>MagicBox</bk-tag>
    <bk-tag theme="success">
      {{ t("企业邮箱") }}
    </bk-tag>
    <bk-tag theme="info">
      {{ t("腾讯视频") }}
    </bk-tag>
    <bk-tag theme="warning">
      {{ t("蓝鲸智云") }}
    </bk-tag>
    <bk-tag theme="danger">
      {{ t("企业微信") }}
    </bk-tag>
    <bk-tag
      class="custom-tag"
    >
      CustomClass
    </bk-tag>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    setup() {
      const { t } = useI18n();
      return {
        t,
      };
    },
  });
</script>

<style scoped>
.custom-tag {
  color: #531dab;
  background: #f9f0ff;
}
</style>
