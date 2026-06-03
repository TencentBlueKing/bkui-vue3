# BkPopConfirm（PopConfirm）实现逻辑说明

`PopConfirm` 是对 `@bkui-vue/popover` 的轻量封装：复用 `Popover` 的定位、触发与显示/隐藏能力，在弹层内容中固定拼装“标题/正文/按钮”，并对外转发确认/取消等事件。

## 目录结构（关键文件）

```
packages/pop-confirm/
├── src/
│   ├── pop-confirm.tsx   # 组件实现（渲染/事件/内部状态）
│   ├── props.ts          # Props/Trigger 定义
│   └── index.ts          # withInstall 导出
└── __test__/pop-confirm.ts
```

## 依赖与职责拆分

- **Popover**：负责触发（hover/click/manual）、延时、clickoutside、Teleport、floating-ui 定位等“弹层通用能力”。
- **PopConfirm**：只负责“确认框内容结构 + 文案 + 按钮”，并将 `Popover` 的 afterShow/afterHidden 转成 `after-show/after-hidden`（Vue 会自动把 `afterShow` 映射为模板事件 `after-show`）。
- **Button**：确认/取消按钮渲染。
- **useLocale('popConfirm')**：提供默认按钮文案（`ok` / `cancel`）。
- **usePrefix()**：生成样式类名前缀（如 `bk-pop-confirm-*`）。

## Props 设计（来自 `src/props.ts`）

`PopConfirm` 自身定义的 props 主要是确认框语义层（标题/正文/按钮）以及把常用的 `Popover` 选项透传出去：

- **trigger**：`hover | click`（默认 `hover`）
- **title**：标题字符串（空则不渲染标题区）
- **content**：正文字符串（当未提供 `#content` 插槽时使用）
- **confirmText / cancelText**：按钮文本（为空则回退到多语言 `ok/cancel`）
- **placement / theme / width**：透传给 `Popover`
- **confirmConfig / cancelConfig**：透传给内部两个 `Button`（允许覆盖 theme/disabled/loading 等）
- **popoverOptions**：额外透传给 `Popover` 的配置对象

## Slots（插槽）

`PopConfirm` 的插槽分三类：

- **default**：触发元素（`Popover` 的 reference 区）
- **content**：确认框正文内容（自定义整段内容时使用）
- **icon**：标题前的 icon（仅当 `title` 非空时渲染）

渲染优先级：

- 有 `#content`：渲染 `title + slot(content)`
- 无 `#content`：渲染 `title + props.content`

## 事件与内部状态（核心链路）

### 内部状态 `visible`

`src/pop-confirm.tsx` 内部有一个 `visible = ref(false)`，并将其作为 `Popover` 的 `isShow` 传入：

- `onAfterShow`：把 `visible` 置为 `true`，并 `emit('after-show')`
- `onAfterHidden`：仅 `emit('after-hidden')`（当前实现**不会**把 `visible` 置回 `false`）
- 点击“确定/取消”按钮：把 `visible` 置为 `false`，分别 `emit('confirm') / emit('cancel')`，并 `stopPropagation`

### 与 `Popover` 的开关关系（重要）

`Popover` 的显示/隐藏由内部的 `useDelay` 维护 `isOpen` 状态：

- 当 `trigger` 为 **hover/click**：显示/隐藏主要由 `useTrigger` 调用 `show/hide/toggle` 驱动，`isShow` 更接近“初始值/状态回传”。
- 当 `trigger` 为 **manual**（或 `always=true`）：`useDelay` 才会监听外部 `isShow` 变化来驱动开关。

因此在 `PopConfirm` 中：

- `visible` 更像是对“当前展示状态”的**弱同步**（依赖 `afterShow` 回调置为 true）。
- `ensure/cancel` 目前只修改 `visible`，并未调用 `popoverRef.hide()`；在 `Popover` 处于 hover/click 触发时，弹层是否立即关闭取决于 `Popover` 自身的触发/关闭策略（例如再次触发、鼠标移出、点击外部等）以及你在 `popoverOptions` 里的配置。

### `popoverOptions` 的覆盖行为

渲染时 `Popover` props 的传入顺序是：

1. `width/extCls/isShow/placement/theme/trigger`
2. `...popoverOptions`

所以 **`popoverOptions` 会覆盖前面同名字段**（包括 `trigger/isShow/placement/...`）。这意味着你可以通过 `popoverOptions` 进一步“精细化”底层 `Popover` 行为（例如设置 `hideIgnoreReference`、`disableOutsideClick`、甚至改成 `trigger: 'manual'` 等）。

