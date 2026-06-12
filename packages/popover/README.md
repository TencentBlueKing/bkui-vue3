# BkPopover 组件设计文档

## 概述

BkPopover 是一个基于 Vue 3 和 `@floating-ui/dom` 实现的弹出层组件，用于在指定元素附近显示浮动内容。支持多种触发方式、位置配置和样式主题。

## 组件架构

```
packages/popover/
├── src/
│   ├── index.ts              # 组件入口，导出 BkPopover 和 $bkPopover
│   ├── popover.tsx           # 主组件实现
│   ├── props.ts              # Props 定义
│   ├── const.tsx             # 常量和事件类型定义
│   ├── content.tsx           # 弹出内容容器组件
│   ├── arrow.tsx             # 箭头组件
│   ├── reference.tsx         # 触发元素包装组件
│   ├── root.tsx              # 根容器组件
│   ├── use-floating.tsx      # 浮动定位 Hook (基于 @floating-ui/dom)
│   ├── use-popover-init.ts   # 初始化逻辑 Hook
│   ├── use-popper-id.ts      # ID 生成 Hook
│   ├── use-platform.tsx      # 平台适配 Hook (全屏场景)
│   ├── plugin-popover.tsx    # 命令式调用插件
│   ├── utils.ts              # 工具函数
│   └── popover.less          # 样式文件
```

## 核心功能

### 1. 位置定位

基于 `@floating-ui/dom` 实现智能定位，支持 12 个位置：

| 位置 | 说明 |
|------|------|
| `top` / `top-start` / `top-end` | 上方 |
| `bottom` / `bottom-start` / `bottom-end` | 下方 |
| `left` / `left-start` / `left-end` | 左侧 |
| `right` / `right-start` / `right-end` | 右侧 |

### 2. 触发方式

| 方式 | 说明 |
|------|------|
| `hover` | 鼠标悬停触发（默认） |
| `click` | 点击触发 |
| `manual` | 手动控制，通过 `isShow` prop 或方法控制 |

### 3. 内容渲染方式

| 方式 | 说明 |
|------|------|
| `auto` | 自动模式，组件挂载即渲染内容 |
| `shown` | 仅在显示时渲染内容 |

### 4. 主题支持

- `dark` - 深色主题（默认）
- `light` - 浅色主题
- 支持自定义主题

---

## Props 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `isShow` | `boolean` | `false` | 控制弹出层显示状态 |
| `always` | `boolean` | `false` | 是否始终显示 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `content` | `string \| HTMLElement \| JSX.Element` | `''` | 弹出内容 |
| `placement` | `PlacementEnum` | `'top-start'` | 弹出位置 |
| `trigger` | `'hover' \| 'click' \| 'manual'` | `'hover'` | 触发方式 |
| `theme` | `string` | `'dark'` | 主题，支持 `dark`、`light` 或自定义 |
| `arrow` | `boolean` | `true` | 是否显示箭头 |
| `width` | `string \| number` | `'auto'` | 弹出内容宽度 |
| `height` | `string \| number` | `'auto'` | 弹出内容高度 |
| `maxWidth` | `string \| number` | `'auto'` | 弹出内容最大宽度 |
| `maxHeight` | `string \| number` | `'auto'` | 弹出内容最大高度 |
| `offset` | `number \| IAxesOffsets` | `6` | 偏移量配置 |
| `padding` | `number` | `5` | 边界内边距 |
| `boundary` | `string \| HTMLElement` | `'body'` | 弹出内容绑定元素 |
| `zIndex` | `number` | `undefined` | 层级，默认自动管理 |
| `target` | `string \| HTMLElement \| PointerEvent` | - | 触发目标元素 |
| `reference` | `any` | - | 自定义 reference 元素 |
| `allowHtml` | `boolean` | `false` | 是否允许 HTML 内容 |
| `renderDirective` | `'if' \| 'show'` | `'if'` | 渲染指令类型 |
| `renderType` | `'auto' \| 'shown'` | - | 内容渲染方式 |
| `autoPlacement` | `boolean` | `false` | 是否自动选择最佳位置 |
| `autoVisibility` | `boolean` | `true` | 滚动超出可视范围时自动隐藏 |
| `disableTeleport` | `boolean` | `false` | 是否禁用 Teleport |
| `disableOutsideClick` | `boolean` | `false` | 是否禁用点击外部关闭 |
| `disableTransform` | `boolean` | `false` | 是否禁用 transform 定位 |
| `clickContentAutoHide` | `boolean` | `false` | 点击内容区是否自动关闭 |
| `popoverDelay` | `number \| number[]` | `100` | 显示/隐藏延时（ms） |
| `extCls` | `string` | `''` | 自定义 Content 样式类名 |
| `referenceCls` | `string` | `''` | 自定义 Reference 样式类名 |
| `hideIgnoreReference` | `boolean` | `false` | 点击 Reference 时是否忽略收起 |
| `componentEventDelay` | `number` | `0` | 组件 pointer-event 延迟时间 |
| `forceClickoutside` | `boolean` | `false` | 强制监听 clickoutside |
| `modifiers` | `array` | `[]` | 兼容 v1 版本的修饰器配置 |

### IAxesOffsets 类型

```typescript
type IAxesOffsets = {
  mainAxis?: number;      // 主轴偏移
  crossAxis?: number;     // 交叉轴偏移
  alignmentAxis?: number | null; // 对齐轴偏移
};
```

---

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `afterShow` | `{ isShow: boolean }` | 弹出层显示后触发 |
| `afterHidden` | `{ isShow: boolean }` | 弹出层隐藏后触发 |
| `clickoutside` | `{ isShow: boolean, event: MouseEvent }` | 点击外部区域时触发 |
| `contentMouseenter` | `MouseEvent` | 鼠标移入内容区触发 |
| `contentMouseleave` | `MouseEvent` | 鼠标移出内容区触发 |

---

## 方法 (Methods)

通过 `ref` 获取组件实例后可调用：

| 方法名 | 参数 | 说明 |
|--------|------|------|
| `show()` | - | 显示弹出层 |
| `hide()` | - | 隐藏弹出层 |
| `updatePopover()` | - | 更新弹出层位置 |
| `resetPopover()` | - | 重置弹出层实例 |
| `stopHide()` | - | 停止隐藏（取消延时隐藏） |

---

## 插槽 (Slots)

| 插槽名 | 说明 |
|--------|------|
| `default` | 触发元素（Reference） |
| `content` | 弹出内容 |
| `arrow` | 自定义箭头 |

---

## 命令式调用 ($bkPopover)

除了组件方式，还支持通过 `$bkPopover` 函数创建弹出层：

```typescript
import { $bkPopover } from 'bkui-vue';

const popover = $bkPopover({
  target: document.querySelector('#target'),  // 必填：目标元素
  content: '弹出内容',                          // 弹出内容
  placement: 'top',                           // 位置
  trigger: 'manual',                          // 触发方式
  immediate: true,                            // 是否立即创建实例
  onShow: () => {},                           // 显示回调
  onHide: () => {},                           // 隐藏回调
  onContentMouseenter: () => {},              // 内容区鼠标移入回调
  onContentMouseleave: () => {},              // 内容区鼠标移出回调
});

// 返回的方法
popover.show(target?);    // 显示弹出层，可传入新的 target
popover.hide();           // 隐藏弹出层
popover.update(event);    // 更新目标位置
popover.close();          // 关闭并销毁实例
popover.install();        // 安装实例
popover.uninstall();      // 卸载实例
popover.vm;               // 获取 Vue 实例
popover.$el;              // 获取 DOM 元素
```

---

## 使用示例

### 基础用法

```vue
<template>
  <BkPopover content="这是提示内容">
    <button>悬停显示</button>
  </BkPopover>
</template>
```

### 点击触发

```vue
<template>
  <BkPopover trigger="click" content="点击显示的内容">
    <button>点击显示</button>
  </BkPopover>
</template>
```

### 手动控制

```vue
<template>
  <BkPopover
    ref="popoverRef"
    trigger="manual"
    :is-show="visible"
  >
    <button @click="visible = !visible">手动控制</button>
    <template #content>
      <div>自定义内容</div>
    </template>
  </BkPopover>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(false);
const popoverRef = ref();

// 通过方法控制
const show = () => popoverRef.value?.show();
const hide = () => popoverRef.value?.hide();
</script>
```

### 位置配置

```vue
<template>
  <BkPopover placement="bottom-start" content="底部左对齐">
    <button>Bottom Start</button>
  </BkPopover>
</template>
```

### 自定义内容和箭头

```vue
<template>
  <BkPopover>
    <button>触发按钮</button>
    <template #content>
      <div class="custom-content">
        <h3>标题</h3>
        <p>详细内容</p>
      </div>
    </template>
    <template #arrow>
      <div class="custom-arrow"></div>
    </template>
  </BkPopover>
</template>
```

---

## 内部实现原理

### 1. 浮动定位 (use-floating.tsx)

基于 `@floating-ui/dom` 库实现，使用的中间件：

- `offset` - 偏移量控制
- `shift` - 边界偏移
- `flip` - 自动翻转
- `arrow` - 箭头定位
- `autoPlacement` - 自动位置选择（可选）
- `hide` - 自动隐藏（可选）
- `inline` - 内联元素支持

### 2. 事件管理 (use-popover-init.ts)

- 根据 `trigger` 类型绑定相应事件
- 支持 `hover` 的 mouseenter/mouseleave/focus/blur
- 支持 `click` 的 click 事件
- 支持 `manual` 的手动控制
- 自动处理 clickoutside 逻辑

### 3. 全屏支持

- 监听 `fullscreenchange` 事件
- 动态更新 boundary 配置
- 支持 Shadow DOM 场景

### 4. Teleport 渲染

- 内容通过 Vue Teleport 渲染到指定 boundary
- 支持禁用 Teleport (`disableTeleport`)
- 根据 `renderDirective` 控制渲染方式

### 5. 延时控制

- `popoverDelay` 支持单值或数组 `[showDelay, hideDelay]`
- 内部通过 setTimeout 实现延时显示/隐藏
- `stopHide()` 方法可取消延时隐藏

---

## 依赖

- `@floating-ui/dom` - 浮动定位核心库
- `@bkui-vue/shared` - 共享工具和类型
- `@bkui-vue/directives` - 指令（clickoutside）
- `@bkui-vue/config-provider` - 配置提供
- `lodash` - 工具函数
- `uuid` - ID 生成
