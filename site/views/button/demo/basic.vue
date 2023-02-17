<template>
  <div class="basic-button-list">
    <bk-button>
      {{ t('基础按钮') }}
    </bk-button>
    <bk-button
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
    name: 'Basic',
    setup() {
      const { t } = useI18n();
      return {
        t,
      };
    },
  });
</script>

<style lang="postcss">
  .basic-button-list {
    display: flex;
  }

  .ml10 {
    margin-left: 10px;
  }
</style>
