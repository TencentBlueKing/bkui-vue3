<template>
  <div style="text-align: left">
    <div class="bk-popover-position-top">
      <bk-popover
        content="Top Left 文字提示"
        placement="top-start"
        :popover-delay="[300, 0]"
      >
        <bk-button>上左</bk-button>
      </bk-popover>
      <bk-popover
        content="Top Center 文字提示"

        :popover-delay="[300, 0]"
      >
        <bk-button>上边</bk-button>
      </bk-popover>
      <bk-popover
        content="Top Right 文字提示"
        placement="top-end"
        :popover-delay="[300, 0]"
      >
        <bk-button>上右</bk-button>
      </bk-popover>
    </div>

    <div class="bk-popover-position-center">
      <div class="bk-popover-position-center-left">
        <bk-popover
          placement="left-start"
          :popover-delay="[300, 0]"
        >
          <bk-button>左上</bk-button>
          <template #content>
            <div>Left</div>
            <div>Top</div>
            <div>文字提示</div>
          </template>
        </bk-popover><br><br>

        <bk-popover
          placement="left"
          :popover-delay="[300, 0]"
        >
          <bk-button>左边</bk-button>
          <template #content>
            <div>Left</div>
            <div>Center</div>
            <div>文字提示</div>
          </template>
        </bk-popover><br><br>

        <bk-popover
          placement="left-end"
          :popover-delay="[300, 0]"
        >
          <bk-button>左下</bk-button>
          <template #content>
            <div>Left</div>
            <div>Bottom</div>
            <div>文字提示</div>
          </template>
        </bk-popover>
      </div>

      <div class="bk-popover-position-center-right">
        <bk-popover
          placement="right-start"
          :popover-delay="[300, 0]"
        >
          <bk-button>右上</bk-button>
          <template #content>
            <div>Right</div>
            <div>Top</div>
            <div>文字提示</div>
          </template>
        </bk-popover><br><br>

        <bk-popover
          placement="right"
          :popover-delay="[300, 0]"
        >
          <bk-button>右边</bk-button>
          <template #content>
            <div>Right</div>
            <div>Center</div>
            <div>文字提示</div>
          </template>
        </bk-popover><br><br>

        <bk-popover
          placement="right-end"
          :popover-delay="[300, 0]"
        >
          <bk-button>右下</bk-button>
          <template #content>
            <div>Right</div>
            <div>Bottom</div>
            <div>文字提示</div>
          </template>
        </bk-popover>
      </div>
    </div>

    <div class="bk-popover-position-bottom">
      <bk-popover
        content="Bottom Left 文字提示"
        placement="bottom-start"
      >
        <bk-button>下左</bk-button>
      </bk-popover>
      <bk-popover
        content="Bottom Center 文字提示"
        placement="bottom"
      >
        <bk-button>下边</bk-button>
      </bk-popover>
      <bk-popover
        content="Bottom Right 文字提示"
        placement="bottom-end"
      >
        <bk-button>下右</bk-button>
      </bk-popover>
    </div>
  </div>
</template>

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
