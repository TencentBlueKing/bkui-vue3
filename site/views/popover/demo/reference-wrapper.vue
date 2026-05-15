<template>
  <div class="popover-reference-wrapper-demo">
    <bk-popover
      content="默认渲染 span"
      trigger="click"
    >
      <bk-button>默认行为</bk-button>
    </bk-popover>

    <bk-popover
      :render-reference-wrapper="false"
      content="原生 DOM 单根节点不渲染 span"
      trigger="click"
    >
      <button class="native-trigger">原生 DOM</button>
    </bk-popover>

    <bk-popover
      :render-reference-wrapper="false"
      content="组件节点不渲染 span"
      trigger="click"
    >
      <bk-button>组件节点</bk-button>
    </bk-popover>

    <bk-config-provider :popover-render-reference-wrapper="false">
      <bk-popover
        content="全局配置仅对子树生效"
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
