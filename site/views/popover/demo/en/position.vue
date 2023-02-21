<template>
  <div style="text-align: left">
    <div class="bk-popover-position-top">
      <bk-popover
        :content="'Top Left text prompt'"
        placement="bottom"
      >
        <bk-button>Top left</bk-button>
      </bk-popover>
      <bk-popover
        :content="'Top Center text prompt'"
        placement="bottom"
      >
        <bk-button>Top edge</bk-button>
      </bk-popover>
      <bk-popover
        :content="'Top Right text prompt'"
        placement="top-end"
      >
        <bk-button>Top right</bk-button>
      </bk-popover>
    </div>

    <div class="bk-popover-position-center">
      <div class="bk-popover-position-center-left">
        <bk-popover placement="left-start">
          <bk-button>Top left</bk-button>
          <template #content>
            <div>Left</div>
            <div>Top</div>
            <div>Text Tips</div>
          </template>
        </bk-popover><br><br>

        <bk-popover placement="left">
          <bk-button>left</bk-button>
          <template #content>
            <div>Left</div>
            <div>Center</div>
            <div>Text Tips</div>
          </template>
        </bk-popover><br><br>

        <bk-popover placement="left-end">
          <bk-button>Bottom left</bk-button>
          <template #content>
            <div>Left</div>
            <div>Bottom</div>
            <div>Text Tips</div>
          </template>
        </bk-popover>
      </div>

      <div class="bk-popover-position-center-right">
        <bk-popover placement="right-start">
          <bk-button>Right Top</bk-button>
          <template #content>
            <div>Right</div>
            <div>Top</div>
            <div>Text Tips</div>
          </template>
        </bk-popover><br><br>

        <bk-popover placement="right">
          <bk-button>Right Center</bk-button>
          <template #content>
            <div>Right</div>
            <div>Center</div>
            <div>Text Tips</div>
          </template>
        </bk-popover><br><br>

        <bk-popover placement="right-end">
          <bk-button>Right Bottom</bk-button>
          <template #content>
            <div>Right</div>
            <div>Bottom</div>
            <div>Text Tips</div>
          </template>
        </bk-popover>
      </div>
    </div>

    <div class="bk-popover-position-bottom">
      <bk-popover
        :content="'Bottom Left text Tips'"
        placement="bottom-start"
      >
        <bk-button>Bottom Left</bk-button>
      </bk-popover>
      <bk-popover
        :content="'Bottom Center text Tips'"
        placement="bottom"
      >
        <bk-button>Bottom Center</bk-button>
      </bk-popover>
      <bk-popover
        :content="'Bottom Right text Tips'"
        placement="bottom-end"
      >
        <bk-button>Bottom Right</bk-button>
      </bk-popover>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import BkMessage from '@bkui-vue/message';
  export default defineComponent({
    setup() {
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
