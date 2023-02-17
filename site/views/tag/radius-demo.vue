<template>
  <div>
    <bk-tag>MagicBox</bk-tag>
    <bk-tag
      theme="success"
      radius="4px"
    >
      {{ t("企业邮箱") }}
    </bk-tag>
    <bk-tag
      theme="info"
      radius="6px"
    >
      {{ t("腾讯视频") }}
    </bk-tag>
    <bk-tag
      theme="warning"
      radius="8px"
    >
      {{ t("蓝鲸智云") }}
    </bk-tag>
    <bk-tag
      theme="danger"
      radius="10px"
    >
      {{ t("企业微信") }}
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
