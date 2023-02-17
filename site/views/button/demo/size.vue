<template>
  <div class="button-group-list">
    <div class="mb10 basic-button-list">
      <span>{{ t('小尺寸') }}</span>
      <bk-button
        class="ml10"
        size="small"
      >
        {{ t('基础按钮') }}
      </bk-button>
      <bk-button
        class="ml10"
        size="small"
      >
        <plus class="f20" />
        {{ t('新增') }}
      </bk-button>
      <bk-button
        class="ml10"
        size="small"
      >
        {{ t('下拉') }}
        <angle-down class="f20" />
      </bk-button>
      <bk-button
        class="ml10"
        size="small"
        loading
      />
      <bk-button
        class="ml10"
        theme="primary"
        size="small"
        loading
      />
      <bk-button
        class="ml10"
        size="small"
      >
        <bk class="f20 mr6" />
        {{ t('成功') }}
      </bk-button>
    </div>

    <div class="mb10 basic-button-list">
      <span>{{ t('默认按钮') }}</span>
      <bk-button class="ml10">
        {{ t('基础按钮') }}
      </bk-button>
      <bk-button class="ml10">
        <plus class="f22" />
        {{ t('新增') }}
      </bk-button>
      <bk-button class="ml10">
        {{ t('下拉') }}
        <angle-down class="f22" />
      </bk-button>
      <bk-button
        class="ml10"
        loading
      />
      <bk-button
        class="ml10"
        theme="primary"
        loading
      />
      <bk-button class="ml10">
        <bk class="f22 mr6" />
        {{ t('成功') }}
      </bk-button>
    </div>

    <div class="basic-button-list">
      <span>{{ t('大尺寸') }}</span>
      <bk-button
        class="ml10"
        size="large"
      >
        {{ t('基础按钮') }}
      </bk-button>
      <bk-button
        class="ml10"
        size="large"
      >
        <plus class="f24" />
        {{ t('新增') }}
      </bk-button>
      <bk-button
        class="ml10"
        size="large"
      >
        {{ t('下拉') }}
        <angle-down class="f24" />
      </bk-button>
      <bk-button
        class="ml10"
        size="large"
        loading
      />
      <bk-button
        class="ml10"
        theme="primary"
        size="large"
        loading
      />
      <bk-button
        class="ml10"
        size="large"
      >
        <bk class="f24 mr6" />
        {{ t("成功") }}
      </bk-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { AngleDown, Bk, Plus } from 'bkui-vue/lib/icon';
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    name: 'Sizes',
    components: {
      AngleDown, Bk, Plus,
    },
    setup() {
      const { t } = useI18n();
      return {
        AngleDown,
        Bk,
        Plus,
        t,
      };
    },
  });
</script>

<style lang="postcss">
.mb10 {
  margin-bottom: 10px;
}

.mr6 {
  margin-right: 6px;
}

.f20 {
  font-size: 20px;
}

.f22 {
  font-size: 22px;
}

.f24 {
  font-size: 24px;
}
</style>
