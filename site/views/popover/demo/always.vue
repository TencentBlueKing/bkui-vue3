<template>
  <bk-popover
    width="300"
    boundary="#hidden_pop_content"
    content="这里是提示文字当鼠标经过这段文字时，会显示一个气泡框当鼠标经过这段文字时，会显示一个气泡框当鼠标经过这段文字时"
    placement="right"
    theme="light"
    always
  >
    <bk-button>总是显示</bk-button>
  </bk-popover>
  <div style="display: none">
    <div id="hidden_pop_content">
      这里是提示文字当鼠标经过这段文字时，会显示一个气泡框当鼠标经过这段文字时，会显示一个气泡框当鼠标经过这段文字时
    </div>
  </div>
</template>
