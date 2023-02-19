<template>
  <div style="text-align: left">
    <div class="bk-popover-position-top">
      <bk-popover
        :content="t('Top Left 文字提示')"
        placement="bottom"
      >
        <bk-button>{{ t('上左') }}</bk-button>
      </bk-popover>
      <bk-popover
        :content="t('Top Center 文字提示')"
        placement="bottom"
      >
        <bk-button>{{ t('上边') }}</bk-button>
      </bk-popover>
      <bk-popover
        :content="t('Top Right 文字提示')"
        placement="top-end"
      >
        <bk-button>{{ t('上右') }}</bk-button>
      </bk-popover>
    </div>

    <div class="bk-popover-position-center">
      <div class="bk-popover-position-center-left">
        <bk-popover placement="left-start">
          <bk-button>{{ t('左上') }}</bk-button>
          <template #content>
            <div>Left</div>
            <div>Top</div>
            <div>{{ t('文字提示') }}</div>
          </template>
        </bk-popover><br><br>

        <bk-popover placement="left">
          <bk-button>{{ t('左边') }}</bk-button>
          <template #content>
            <div>Left</div>
            <div>Center</div>
            <div>{{ t('文字提示') }}</div>
          </template>
        </bk-popover><br><br>

        <bk-popover placement="left-end">
          <bk-button>{{ t('左下') }}</bk-button>
          <template #content>
            <div>Left</div>
            <div>Bottom</div>
            <div>{{ t('文字提示') }}</div>
          </template>
        </bk-popover>
      </div>

      <div class="bk-popover-position-center-right">
        <bk-popover placement="right-start">
          <bk-button>{{ t('右边') }}</bk-button>
          <template #content>
            <div>Right</div>
            <div>Top</div>
            <div>{{ t('文字提示') }}</div>
          </template>
        </bk-popover><br><br>

        <bk-popover placement="right">
          <bk-button>{{ t('右边') }}</bk-button>
          <template #content>
            <div>Right</div>
            <div>Center</div>
            <div>{{ t('文字提示') }}</div>
          </template>
        </bk-popover><br><br>

        <bk-popover placement="right-end">
          <bk-button>{{ t('右下') }}}</bk-button>
          <template #content>
            <div>Right</div>
            <div>Bottom</div>
            <div>{{ t('文字提示') }}</div>
          </template>
        </bk-popover>
      </div>
    </div>

    <div class="bk-popover-position-bottom">
      <bk-popover
        :content="`Bottom Left ${t('文字提示')}`"
        placement="bottom-start"
      >
        <bk-button>{{ t('下左') }}</bk-button>
      </bk-popover>
      <bk-popover
        :content="`Bottom Center ${t('文字提示')}`"
        placement="bottom"
      >
        <bk-button>{{ t('下边') }}</bk-button>
      </bk-popover>
      <bk-popover
        :content="`Bottom Right ${t('文字提示')}`"
        placement="bottom-end"
      >
        <bk-button>{{ t('下右') }}</bk-button>
      </bk-popover>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';

  import BkMessage from '@bkui-vue/message';
  export default defineComponent({
    setup() {
      const { t } = useI18n();

      const handleShow = () => {
        BkMessage({
          theme: 'success',
          message: 'onShow',
        });
      };

      const handleHide = () => {
        BkMessage({
          theme: 'error',
          message: 'onClose',
        });
      };

      return {
        handleShow,
        handleHide,
        t,
      };
    },
  });
</script>

<style lang="postcss">
.bk-popover-position-top,
.bk-popover-position-bottom {
  margin-left: 80px;
}

.bk-popover-position-top div ~ div {
  margin-left: 10px;
}

.bk-popover-position-bottom div ~ div {
  margin-left: 10px;
}

.bk-popover-position-center {
  margin: 10px auto;
}

.bk-popover-position-center-left {
  display: inline-block;
}

.bk-popover-position-center-right {
  display: inline-block;
  margin-left: 250px;
}
</style>
