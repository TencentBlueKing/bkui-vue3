<template>
  <bk-button @click="handleBtnClick(true)">
    {{ t("手动设置IsShow = true") }}
  </bk-button>
  <bk-button @click="handleBtnClick(false)">
    {{ t("手动设置IsShow = false") }}
  </bk-button>
  <bk-popover
    trigger="click"
    :is-show="isShow"
    width="450"
    @after-hidden="handleAfterHidden"
  >
    <bk-button>
      {{ t("当鼠标点击") }}
    </bk-button>
    <template #content>
      <div>
        <span>{{ t('今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错') }}</span>
        <span>{{ t('今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错') }}</span>>
        <span>{{ t('今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错') }}</span>
        <span>{{ t('今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错') }}</span>
        <span>{{ t('今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错') }}</span>
        <span>{{ t('今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错') }}</span>
        <span>{{ t('今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错') }}</span>
      </div>
    </template>
  </bk-popover>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const isShow = ref(false);

      const handleBtnClick = (val) => {
        isShow.value = val;
      };

      const handleAfterHidden = ({ isShow }) => {
        isShow.value  = isShow;
      };

      return {
        isShow,
        handleBtnClick,
        handleAfterHidden,
        t,
      };
    },
  });
</script>
