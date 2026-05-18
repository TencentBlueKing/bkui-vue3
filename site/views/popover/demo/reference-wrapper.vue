<template>
  <div class="popover-reference-wrapper-demo">
    <bk-popover
      :render-reference-wrapper="true"
      content="显式渲染 span"
      trigger="click"
    >
      <bk-button>显式 wrapper</bk-button>
    </bk-popover>

    <bk-popover
      content="默认不渲染 span"
      trigger="click"
    >
      <button class="native-trigger">默认行为</button>
    </bk-popover>

    <bk-popover
      :render-reference-wrapper="false"
      content="组件节点不渲染 span"
      trigger="click"
    >
      <bk-button>组件节点</bk-button>
    </bk-popover>

    <bk-config-provider :popover-render-reference-wrapper="true">
      <bk-popover
        content="全局配置开启 wrapper"
        trigger="click"
      >
        <button class="native-trigger">全局配置示例</button>
      </bk-popover>
    </bk-config-provider>
  </div>
</template>

<style scoped>
.popover-reference-wrapper-demo {
  display: flex;
  gap: 12px;
  align-items: center;
}

.native-trigger {
  height: 32px;
  padding: 0 16px;
  color: #63656e;
  cursor: pointer;
  background: #fff;
  border: 1px solid #c4c6cc;
  border-radius: 2px;
}
</style>
