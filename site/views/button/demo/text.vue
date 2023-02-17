<template>
  <div class="basic-button-list">
    <bk-button
      text
      theme="primary"
    >
      {{ t('文字按钮') }}
    </bk-button>
    <bk-button
      text
      theme="primary"
      disabled
      class="ml10"
      loading
    >
      {{ t('加载中') }}
    </bk-button>
    <bk-button
      text
      class="ml10"
      disabled
    >
      {{ t('禁用状态') }}
    </bk-button>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  // import Loading from '@bkui-vue/loading';
  export default defineComponent({
    name: 'Text',
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
