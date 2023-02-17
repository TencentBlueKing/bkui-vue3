<template>
  <div class="disabled-button-list">
    <bk-button
      disabled
      class="ml10"
    >
      {{ t('基础按钮') }}
    </bk-button>
    <bk-button
      disabled
      theme="primary"
      class="ml10"
    >
      {{ t('主要按钮') }}
    </bk-button>
  </div>
</template>

<script lang="ts">
  import  { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    name: 'Disabled',
    setup() {
      const { t } = useI18n();
      return {
        t,
      };
    },
  });
</script>

