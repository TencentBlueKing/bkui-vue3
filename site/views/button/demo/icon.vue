<template>
  <div class="basic-button-list">
    <bk-button>
      <plus class="f22" />
      {{ t('新增') }}
    </bk-button>
    <bk-button
      theme="primary"
      class="ml10"
    >
      {{ t('下拉') }}
      <angle-down class="f22" />
    </bk-button>
    <bk-button
      class="ml10"
    >
      <search class="f22" />
    </bk-button>
    <bk-button
      class="ml10"
      theme="primary"
      circle
    >
      <search class="f22" />
    </bk-button>
    <bk-button
      class="ml10"
    >
      <loading
        class="mr6"
        loading
        size="mini"
        mode="spin"
      />
      loading
    </bk-button>
    <bk-button
      class="ml10"
      loading
    />
    <bk-button
      theme="primary"
      class="ml10"
      loading
    />
    <bk-button
      class="ml10"
      loading
      loading-mode="spin"
    />
    <bk-button
      class="ml10"
      theme="primary"
      loading
      loading-mode="spin"
    />
  </div>
</template>

<script>
  import { Loading } from 'bkui-vue';
  import { AngleDown, Plus, Search } from 'bkui-vue/lib/icon';
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    name: 'Icon',
    components: {
      AngleDown, Plus, Search,
    },
    setup() {
      const { t } = useI18n();
      return {
        t,
        Loading,
        AngleDown,
        Plus,
        Search,
      };
    },
  });
</script>

<style lang="postcss">
  .ml10 {
    margin-left: 10px;
  }

  .mr6 {
    margin-right: 6px;
  }

  .f22 {
    font-size: 22px;
  }
</style>
