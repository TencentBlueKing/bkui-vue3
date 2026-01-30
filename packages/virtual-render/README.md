## Virtual-Render 组件实现说明

### 一、组件概述

这是一个**虚拟滚动渲染组件**，核心思想是只渲染可视区域内的数据，而非全部数据，从而大幅提升大数据量列表的渲染性能。

**使用原生滚动**，避免自定义滚动条带来的计算和布局问题。

### 二、文件结构

| 文件 | 作用 |
|------|------|
| `index.ts` | 入口文件，使用 `withInstall` 注册组件 |
| `props.ts` | 属性定义和类型声明 |
| `virtual-render.tsx` | 主组件实现 |
| `v-virtual-render.ts` | 虚拟渲染核心算法（`VisibleRender` 类） |
| `use-scrollbar.tsx` | 原生滚动管理 Hook |
| `use-fix-top.tsx` | 滚动定位 Hook |
| `use-tag-render.tsx` | 非虚拟模式降级渲染 Hook |

### 三、核心属性

```typescript
// 关键属性说明
list: []              // 原始数据源
enabled: true         // 是否启用虚拟渲染
lineHeight: 30        // 行高（支持 number 或 function）
height: '100%'        // 容器高度
groupItemCount: 1     // 分组数（一行显示多条数据）
preloadItemCount: 1   // 预加载行数
throttleDelay: 60     // 滚动节流延迟(ms)
keepAlive: false      // 数据变化时是否保持滚动位置
```

### 四、核心渲染流程

```
┌─────────────────────────────────────────────────────────┐
│  1. 初始化                                               │
│     ├─ enabled=false → useTagRender 普通渲染            │
│     └─ enabled=true  → 创建 VisibleRender 实例          │
├─────────────────────────────────────────────────────────┤
│  2. 滚动监听（原生 scroll 事件）                         │
│     └─ handleScroll → throttledRender (throttle 节流)   │
├─────────────────────────────────────────────────────────┤
│  3. 计算可见区域 (computedVirtualIndex)                  │
│     ├─ 固定行高: startIndex = floor(scrollTop/lineHeight)│
│     └─ 动态行高: getMatchedIndex 遍历累加计算            │
├─────────────────────────────────────────────────────────┤
│  4. 回调更新 (handleScrollCallback)                      │
│     ├─ 更新 pagination 状态                              │
│     ├─ 应用预加载 (preloadItemCount)                     │
│     └─ 切片 calcList = list.slice(start, end)           │
├─────────────────────────────────────────────────────────┤
│  5. 渲染输出                                             │
│     ├─ 占位元素 (virtual-section) 撑起滚动高度           │
│     └─ 内容容器 (virtual-content) + transform 定位       │
│     └─ slot.default({ data: calcList, pagination })     │
└─────────────────────────────────────────────────────────┘
```

### 五、DOM 结构

```html
<div class="bk-virtual-render" style="overflow: auto; height: xxx">
  <!-- 占位元素，撑起完整滚动高度 -->
  <div class="bk-virtual-section" style="height: totalHeight; position: absolute"></div>
  
  <!-- 实际渲染内容，使用 transform 定位 -->
  <div class="bk-virtual-content" style="transform: translateY(startOffset)">
    <!-- slot 内容，只渲染可见数据 -->
  </div>
</div>
```

### 六、核心算法

**1. 固定行高计算**

```typescript
// 计算起始索引（向下取整）
targetStartIndex = Math.floor(scrollTop / lineHeight);
// 计算结束索引（向上取整 + 1 确保覆盖）
targetEndIndex = Math.ceil(offsetHeight / lineHeight) + targetStartIndex + 1;
```

**2. 内容定位计算** (`getStartOffset`)

```typescript
// 固定行高
offset = startIndex * lineHeight;

// 动态行高
for (let i = 0; i < startIndex; i++) {
  offset += lineHeight(getRowHeightArgs(i));
}
```

**3. 动态行高计算** (`getMatchedIndex`)

```typescript
// 遍历累加每行高度，找到匹配 scrollTop 的起始索引
for (; startIndex < maxCount; startIndex++) {
  lastHeight = callback({ index: startIndex });
  if (height + lastHeight > maxHeight) {
    diffHeight = maxHeight - height;
    startIndex = startIndex + Math.round(diffHeight / lastHeight);
    break;
  }
  height += lastHeight;
}
```

### 七、关键状态管理

```typescript
const pagination = reactive({
  startIndex: 0,      // 可见区域起始索引
  endIndex: 0,        // 可见区域结束索引
  scrollTop: 1,       // 当前滚动位置
  scrollLeft: 0,
  translateY: 0,      // Y轴偏移量
  count: 0,           // 总行数
  groupItemCount: 1,  // 分组数
});

const calcList = ref([]);  // 当前可见的数据切片
```

### 八、暴露的实例方法

```typescript
ctx.expose({
  reset,        // 重置组件状态
  scrollTo,     // 滚动到指定位置 (x, y)
  fixToTop,     // 指定元素滚动到顶部（支持 index/id/item）
  refRoot,      // 根 DOM 引用
  refContent,   // 内容 DOM 引用
});
```

### 九、两种渲染模式

| 模式 | enabled | 实现 |
|------|---------|------|
| 虚拟渲染 | `true` | 只渲染可见区域，使用 `VisibleRender` 计算 |
| 普通渲染 | `false` | 使用 `useTagRender`，渲染全部数据 |

### 十、滚动实现

- **使用原生滚动**：通过 CSS `overflow: auto` 实现
- 监听原生 `scroll` 事件，使用 `{ passive: true }` 优化性能
- 支持自定义滚动条样式（通过 CSS `scrollXName`, `scrollYName`）

### 十一、性能优化点

1. **throttle 节流** - 滚动事件 60ms 间隔触发
2. **预加载** - `preloadItemCount` 避免空白闪烁
3. **keepAlive** - 数据变化时可保持滚动位置
4. **分组渲染** - `groupItemCount` 支持一行多条数据
5. **passive 事件** - 滚动监听使用 passive 模式，提升滚动流畅度
6. **will-change** - 内容容器使用 `will-change: transform` 优化渲染
