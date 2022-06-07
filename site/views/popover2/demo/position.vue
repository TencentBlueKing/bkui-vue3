<template>
  <div class="bk-popover2-position-top">
    <bk-popover2
      content="Top Left 文字提示"
      placement="top-start"
    >
      <bk-button>上左</bk-button>
    </bk-popover2>
    <bk-popover2
      content="Top Center 文字提示"
      placement="top"
    >
      <bk-button>上边</bk-button>
    </bk-popover2>
    <bk-popover2
      content="Top Right 文字提示"
      placement="top-end"
    >
      <bk-button>上右</bk-button>
    </bk-popover2>
  </div>

  <div class="bk-popover2-position-center">
    <div class="bk-popover2-position-center-left">
      <bk-popover2 placement="left-start">
        <bk-button>左上</bk-button>
        <template #content>
          <div>Left</div>
          <div>Top</div>
          <div>文字提示</div>
        </template>
      </bk-popover2><br><br>

      <bk-popover2 placement="left">
        <bk-button>左边</bk-button>
        <template #content>
          <div>Left</div>
          <div>Center</div>
          <div>文字提示</div>
        </template>
      </bk-popover2><br><br>

      <bk-popover2 placement="left-end">
        <bk-button>左下</bk-button>
        <template #content>
          <div>Left</div>
          <div>Bottom</div>
          <div>文字提示</div>
        </template>
      </bk-popover2>
    </div>

    <div class="bk-popover2-position-center-right">
      <bk-popover2 placement="right-start">
        <bk-button>右上</bk-button>
        <template #content>
          <div>Right</div>
          <div>Top</div>
          <div>文字提示</div>
        </template>
      </bk-popover2><br><br>

      <bk-popover2 placement="right">
        <bk-button>右边</bk-button>
        <template #content>
          <div>Right</div>
          <div>Center</div>
          <div>文字提示</div>
        </template>
      </bk-popover2><br><br>

      <bk-popover2 placement="right-end">
        <bk-button>右下</bk-button>
        <template #content>
          <div>Right</div>
          <div>Bottom</div>
          <div>文字提示</div>
        </template>
      </bk-popover2>
    </div>
  </div>

  <div class="bk-popover2-position-bottom">
    <bk-popover2
      content="Bottom Left 文字提示"
      placement="bottom-start"
    >
      <bk-button>下左</bk-button>
    </bk-popover2>
    <bk-popover2
      content="Bottom Center 文字提示"
      placement="bottom"
    >
      <bk-button>下边</bk-button>
    </bk-popover2>
    <bk-popover2
      content="Bottom Right 文字提示"
      placement="bottom-end"
    >
      <bk-button>下右</bk-button>
    </bk-popover2>
  </div>
</template>

<style lang="postcss">
  .bk-popover2-position-top,
  .bk-popover2-position-bottom {
    margin-left: 80px;
  }

  .bk-popover2-position-top div ~ div {
    margin-left: 10px;
  }

  .bk-popover2-position-bottom div ~ div {
    margin-left: 10px;
  }

  .bk-popover2-position-center {
    margin: 10px auto;
  }

  .bk-popover2-position-center-left {
    display: inline-block;
  }

  .bk-popover2-position-center-right {
    display: inline-block;
    margin-left: 250px;
  }
</style>
