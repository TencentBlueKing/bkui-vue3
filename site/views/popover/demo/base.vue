<template>
  <bk-popover
    content="#hidden_pop_content"
    allow-html
    theme="light xxxxx"
    width="400"
  >
    <div>
      当鼠标经过这段文字时，会显示一个气泡框
    </div>
  </bk-popover>
  <div style="display: none;">
    <div id="hidden_pop_content">
      JSX value should be either an expression or a quoted JSX text ...
      Quoted JSX attributes use XML-style escapes #1225 - GitHub
      Substitution Scholia and Thucydides' Use of Prepositions
    </div>
  </div>
</template>
