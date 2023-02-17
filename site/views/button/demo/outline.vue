<template>
  <div class="basic-button-list">
    <bk-button outline>
      {{ t('反色按钮') }}
    </bk-button>
    <bk-button
      outline
      theme="primary"
      class="ml10"
    >
      {{ t('反色按钮') }}
    </bk-button>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    name: 'Outline',
    setup() {
      const { t } = useI18n();
      return {
        t,
      };
    },
  });
</script>

<style lang="postcss">
  .ml10 {
    margin-left: 10px;
  }
</style>
