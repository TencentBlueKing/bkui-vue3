<template>
  {{ t('滚动页面，滚动条超过40px后，按钮会出现在右下角') }}
  <bk-backtop target=".body-wrapper" />
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
