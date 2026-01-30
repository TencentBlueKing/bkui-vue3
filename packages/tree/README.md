# Tree 组件说明文档

## 一、概述

Tree 组件是一个功能完整的树形数据展示组件，支持节点展开/折叠、选中、复选框、搜索、异步加载、拖拽排序、虚拟滚动等功能。

## 二、文件结构

```
packages/tree/src/
├── index.ts                    # 组件入口
├── tree.tsx                    # 主组件（核心逻辑）
├── props.ts                    # Props 定义
├── constant.ts                 # 常量定义（事件、节点属性枚举）
├── util.ts                     # 工具函数
├── tree.less                   # 样式文件
├── use-tree-init.tsx           # 树初始化（数据扁平化）
├── use-node-action.tsx         # 节点操作（渲染、点击、选中）
├── use-node-attribute.tsx      # 节点属性管理
├── use-node-async.tsx          # 异步加载功能
├── use-node-drag.tsx           # 拖拽功能
├── use-search.tsx              # 搜索功能
├── use-empty.tsx               # 空状态处理
├── use-intersection-observer.tsx # 交叉观察器
└── use-array-move.tsx          # 数组移动工具
```

## 三、Props 配置

### 3.1 数据相关

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | `TreeNode[]` | `[]` | 树形数据 |
| `label` | `string \| function` | `'label'` | 节点标签字段或函数 |
| `nodeKey` | `string` | - | 节点唯一标识字段 |
| `children` | `string` | `'children'` | 子节点字段名 |

### 3.2 样式相关

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `indent` | `number` | `16` | 缩进距离(px) |
| `lineHeight` | `number` | `32` | 行高(px) |
| `height` | `number` | - | 树高度 |
| `levelLine` | `boolean \| string \| function` | `false` | 层级连线 |
| `offsetLeft` | `number` | `5` | 左侧偏移(px) |

### 3.3 功能相关

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `virtualRender` | `boolean` | `false` | 是否启用虚拟滚动 |
| `prefixIcon` | `boolean \| function` | `true` | 前缀图标 |
| `showNodeTypeIcon` | `boolean` | `true` | 显示节点类型图标 |
| `selectable` | `boolean \| function` | `true` | 是否可选中 |
| `showCheckbox` | `boolean \| function` | `false` | 显示复选框 |
| `checked` | `any[]` | `[]` | 默认选中节点 ID |
| `selected` | `string \| number \| object` | - | 默认选中节点 |
| `expandAll` | `boolean` | `false` | 默认展开所有 |
| `autoOpenParentNode` | `boolean` | `true` | 自动展开父节点 |
| `autoCheckChildren` | `boolean \| function` | `true` | 自动选中子节点 |
| `checkStrictly` | `boolean` | `true` | 严格父子关联 |
| `nodeContentAction` | `string[] \| function` | `['selected', 'expand', 'click']` | 节点内容点击行为 |

### 3.4 搜索配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `search` | `string \| number \| boolean \| SearchOption` | - | 搜索配置 |

**SearchOption:**
```typescript
{
  value: string | number;           // 搜索值
  match: 'fuzzy' | 'full' | function; // 匹配方式
  resultType: 'tree' | 'list';      // 结果展示类型
  showChildNodes: boolean;          // 是否显示匹配项子节点
}
```

### 3.5 异步加载配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `async` | `AsyncOption` | - | 异步加载配置 |

**AsyncOption:**
```typescript
{
  callback: (node, callback, schema) => Promise | void; // 异步回调
  cache: boolean;                    // 是否缓存（默认 true）
  deepAutoOpen: 'once' | 'every';    // 深度自动展开
  trigger: ['expand' | 'click' | 'checked']; // 触发时机
}
```

### 3.6 拖拽配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `draggable` | `boolean` | `false` | 是否可拖拽 |
| `disableDrag` | `function` | - | 禁用拖拽判断函数 |
| `disableDrop` | `function` | - | 禁用释放判断函数 |
| `dragThreshold` | `number` | `0.2` | 拖拽阈值 |
| `dragSort` | `boolean` | `false` | 拖拽排序模式 |
| `dragSortMode` | `'any' \| 'next'` | `'any'` | 排序模式 |

### 3.7 其他配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `keepSlotData` | `boolean` | `false` | 插槽数据保持原始引用 |
| `intersectionObserver` | `boolean \| object` | - | 交叉观察器配置 |
| `emptyText` | `string` | `'没有数据'` | 空状态文本 |

## 四、节点属性系统

### 4.1 存储机制

使用 `WeakMap` 存储节点元数据，避免内存泄漏，不修改原始数据。

### 4.2 属性枚举 (NODE_ATTRIBUTES)

```typescript
enum NODE_ATTRIBUTES {
  DEPTH = '__depth',              // 节点深度
  HAS_CHILD = '__has_child',      // 是否有子节点
  INDEX = '__index',              // 节点索引
  IS_ASYNC = '__is_async',        // 是否异步节点
  IS_ASYNC_INIT = '__is_async_init', // 异步是否已初始化
  IS_CACHED = '__is_cached',      // 是否已缓存
  IS_CHECKED = '__is_checked',    // 复选框是否选中
  IS_INDETERMINATE = '__is_indeterminate', // 半选状态
  IS_LOADING = '__is_loading',    // 是否加载中
  IS_MATCH = '__is_match',        // 是否匹配搜索
  IS_OPEN = '__is_open',          // 是否展开
  IS_ROOT = '__is_root',          // 是否根节点
  IS_SELECTED = '__is_selected',  // 是否选中
  ORDER = '__order',              // 排序顺序
  PARENT = '__parent',            // 父节点引用
  PATH = '__path',                // 节点路径
  UUID = '__uuid',                // 唯一标识
}
```

## 五、事件系统

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `nodeClick` | 节点点击 | `(node, schema)` |
| `nodeExpand` | 节点展开 | `(node, schema)` |
| `nodeCollapse` | 节点收起 | `(node, schema)` |
| `nodeSelected` | 节点选中 | `(node, schema)` |
| `nodeChecked` | 复选框变化 | `(checkedList, schema)` |
| `nodeDragStart` | 拖拽开始 | `(node, event)` |
| `nodeDragOver` | 拖拽经过 | `(node, event)` |
| `nodeDragLeave` | 拖拽离开 | `(node, event)` |
| `nodeDragSort` | 拖拽排序 | `(node, target, position)` |
| `nodeDrop` | 拖拽释放 | `(node, target, dropType)` |
| `nodeEnterView` | 节点进入可视区域 | `(node, schema)` |

## 六、暴露的方法

```typescript
// 节点操作
handleTreeNodeClick(node)     // 触发节点点击
setOpen(node, isOpen)         // 设置节点展开/收起
setNodeOpened(node, isOpen)   // 同上（别名）
setSelect(node)               // 设置节点选中
setChecked(nodes, checked)    // 设置复选框状态
setCheckedById(ids, checked)  // 根据 ID 设置复选框状态
setNodeAction(node, action)   // 设置节点行为

// 状态查询
isNodeChecked(node)           // 判断节点是否选中（复选框）
isRootNode(node)              // 判断是否根节点
isNodeOpened(node)            // 判断节点是否展开
isNodeMatched(node)           // 判断节点是否匹配搜索
hasChildNode(node)            // 判断是否有子节点
getNodeAttr(node, attr)       // 获取节点属性
getParentNode(node)           // 获取父节点

// 其他
scrollToTop(node)             // 滚动到顶部/指定节点
asyncNodeClick(node)          // 手动触发异步加载
getData()                     // 获取树数据
reset()                       // 重置
```

## 七、插槽系统

| 插槽名 | 说明 | 参数 |
|--------|------|------|
| `default` / `node` | 节点内容 | `{ node, ...attributes }` 或 `{ data, attributes }` |
| `nodeType` | 节点类型图标 | 同上 |
| `nodeAction` | 节点操作图标 | 同上 |
| `nodeLoading` | 节点加载状态 | 同上 |
| `nodeAppend` | 节点追加内容 | 同上 |
| `empty` | 空状态 | - |

**注意：** `keepSlotData=true` 时，插槽参数为 `{ data: node, attributes: {} }`，保持原始数据引用。

## 八、核心功能实现逻辑

### 8.1 数据扁平化 (use-tree-init.tsx)

**执行流程：**
1. 递归遍历树形数据
2. 为每个节点生成 UUID（优先使用 `nodeKey`）
3. 计算节点深度、索引、路径
4. 使用 `WeakMap` 存储元数据
5. 初始化展开、选中、匹配等状态
6. 返回扁平化数组 `flatData`

**关键函数：**
- `getFlatdata()`: 主扁平化函数
- `loopUpdateNodeAttr()`: 递归更新属性
- `getCachedTreeNodeAttr()`: 数据更新时保留已有状态

### 8.2 节点渲染 (use-node-action.tsx)

**渲染结构：**
```html
<div class="bk-node-row">
  <div class="bk-tree-node">
    <div class="bk-node-action">      <!-- 展开/收起图标 -->
    <div class="bk-node-content">
      <Checkbox />                    <!-- 复选框（可选） -->
      <Icon />                        <!-- 节点类型图标 -->
      <span class="bk-node-text">     <!-- 节点文本/插槽 -->
      <slot name="nodeAppend" />      <!-- 追加内容 -->
    </div>
    <div class="node-virtual-line">   <!-- 层级连线 -->
  </div>
</div>
```

**渲染逻辑：**
1. 根据 `IS_OPEN` 属性判断显示/隐藏
2. 根据深度计算缩进
3. 根据 `IS_CHECKED` 和 `IS_INDETERMINATE` 渲染复选框状态
4. 根据 `hasChild` 和 `isOpen` 渲染展开图标

### 8.3 展开/折叠

**执行逻辑：**
1. 点击展开图标或节点内容（取决于 `nodeContentAction`）
2. 调用 `setNodeOpened(node, isOpen)`
3. 更新 `IS_OPEN` 属性
4. 如果收起，递归关闭所有子节点
5. 触发 `nodeExpand` 或 `nodeCollapse` 事件

### 8.4 选中

**单选逻辑：**
1. 清除之前的选中状态
2. 设置当前节点 `IS_SELECTED = true`
3. 如果 `autoOpenParentNode=true`，递归展开父节点
4. 触发 `nodeSelected` 事件

### 8.5 复选框

**父子关联逻辑（checkStrictly=true）：**
1. 选中节点时，递归设置所有子节点为选中
2. 更新父节点状态：
   - 所有子节点选中 → 父节点选中
   - 部分子节点选中 → 父节点半选
   - 无子节点选中 → 父节点取消选中
3. 触发 `nodeChecked` 事件，返回所有选中节点

**半选状态计算：**
```typescript
function isIndeterminate(node) {
  const children = getChildNodes(node);
  const checkedCount = children.filter(isChecked).length;
  return checkedCount > 0 && checkedCount < children.length;
}
```

### 8.6 搜索 (use-search.tsx)

**匹配逻辑：**
- `fuzzy`: 模糊匹配 `label.includes(value)`
- `full`: 完全匹配 `label === value`
- `function`: 自定义匹配函数

**过滤逻辑：**
1. 遍历所有节点，计算 `IS_MATCH`
2. `resultType='tree'`: 匹配项及其祖先节点显示
3. `resultType='list'`: 只显示匹配项
4. `showChildNodes=true`: 同时显示匹配项的子节点
5. 使用 `debounce(120ms)` 优化性能

### 8.7 异步加载 (use-node-async.tsx)

**加载流程：**
1. 触发条件：点击展开 / 节点点击 / 选中（取决于 `trigger`）
2. 设置 `IS_LOADING = true`
3. 调用 `async.callback(node, callback, schema)`
4. 接收返回的子节点数据
5. 插入子节点，重新扁平化
6. 设置 `IS_CACHED = true`（如果 `cache=true`）
7. 设置 `IS_LOADING = false`
8. 自动展开节点

**深度自动展开（deepAutoOpen）：**
- `once`: 仅首次展开时递归加载
- `every`: 每次展开都递归加载

### 8.8 拖拽 (use-node-drag.tsx)

**拖拽流程：**
1. `mousedown`: 设置 `draggable=true`
2. `dragstart`: 记录拖拽节点，添加样式
3. `dragover`: 计算放置位置
   - 鼠标在节点上方 20% → `drop-before`
   - 鼠标在节点下方 20% → `drop-after`
   - 鼠标在节点中间 → `drop-inner`
4. `drop`: 执行操作
   - `dragSort=false`: 作为目标节点的子节点
   - `dragSort=true`: 排序模式
5. `dragleave/dragend`: 清理样式

**排序模式（dragSort=true）：**
- `any`: 可拖拽到任意位置
- `next`: 只能在同级节点间排序

**数据更新：**
```typescript
function updateTreeData(nodes) {
  // 重新计算所有节点的 index、path、depth
  // 更新 WeakMap 中的元数据
  // 触发响应式更新
}
```

### 8.9 虚拟滚动

**实现方式：**
- 使用 `@bkui-vue/virtual-render` 组件
- 根据 `lineHeight` 计算可见区域
- 只渲染可见范围内的节点
- 通过 `scrollToTop()` 定位到指定节点

### 8.10 交叉观察器 (use-intersection-observer.tsx)

**功能：**
- 监听节点进入可视区域
- 支持自定义回调
- 触发 `nodeEnterView` 事件

**实现：**
- 虚拟滚动模式：使用 `IntersectionObserver`
- 非虚拟滚动：使用 `MutationObserver` 监听 DOM 变化

## 九、性能优化

1. **虚拟滚动**: 大数据量时只渲染可见节点
2. **WeakMap**: 节点元数据存储，避免内存泄漏
3. **防抖**: 搜索使用 `debounce(120ms)`
4. **节流**: 拖拽使用 `throttle`
5. **缓存**: 异步加载结果缓存
6. **事件委托**: 拖拽事件委托到根元素

## 十、使用示例

### 基础用法

```vue
<template>
  <bk-tree :data="treeData" label="name" />
</template>

<script setup>
const treeData = [
  {
    name: '节点1',
    children: [
      { name: '子节点1-1' },
      { name: '子节点1-2' }
    ]
  }
]
</script>
```

### 复选框

```vue
<bk-tree
  :data="treeData"
  show-checkbox
  :checked="['1', '2']"
  @node-checked="handleChecked"
/>
```

### 异步加载

```vue
<bk-tree
  :data="treeData"
  :async="{
    callback: loadChildren,
    cache: true,
    deepAutoOpen: 'once'
  }"
/>

<script setup>
const loadChildren = async (node) => {
  const children = await fetchChildren(node.id)
  return children
}
</script>
```

### 搜索

```vue
<bk-tree
  :data="treeData"
  :search="{
    value: searchValue,
    match: 'fuzzy',
    resultType: 'tree'
  }"
/>
```

### 拖拽

```vue
<bk-tree
  :data="treeData"
  draggable
  drag-sort
  drag-sort-mode="any"
  @node-drop="handleDrop"
/>
```

### 虚拟滚动

```vue
<bk-tree
  :data="largeData"
  virtual-render
  :height="400"
  :line-height="32"
/>
```

### 自定义渲染

```vue
<bk-tree :data="treeData">
  <template #node="{ data }">
    <span>{{ data.name }}</span>
    <span class="count">{{ data.count }}</span>
  </template>
  <template #nodeAppend="{ data }">
    <button @click="handleEdit(data)">编辑</button>
  </template>
</bk-tree>
```

## 十一、路径系统

节点路径使用 `-` 分隔的字符串表示层级关系：

```
根节点1: "0"
├── 子节点1-1: "0-0"
│   └── 孙节点1-1-1: "0-0-0"
├── 子节点1-2: "0-1"
根节点2: "1"
└── 子节点2-1: "1-0"
```

用于定位节点、计算父子关系、更新层级。

## 十二、设计特点

1. **数据驱动**: 通过 `WeakMap` 管理状态，不修改原始数据
2. **组合式 API**: 使用多个 composables 拆分功能
3. **可扩展**: 支持自定义图标、插槽、匹配函数等
4. **类型安全**: 完整的 TypeScript 类型定义
5. **性能优化**: 虚拟滚动、WeakMap、事件委托等
