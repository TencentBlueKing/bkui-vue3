<template>
  <div>
    <bk-tag
      closable
      @close="handleTagClose"
    >
      MagicBox
    </bk-tag>
    <bk-tag
      theme="info"
      closable
      @close="handleTagClose"
    >
      {{ t('企业邮箱') }}
    </bk-tag>
  </div>
</template>


<script>
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    setup() {
      const { t } = useI18n();

      const handleTagClose = e => console.log(e);
      return {
        handleTagClose,
        t,
      };
    },
  });
</script>
