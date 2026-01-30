# BkTable 组件实现架构与逻辑分析

## 目录

- [1. 架构概览](#1-架构概览)
- [2. 核心文件结构](#2-核心文件结构)
- [3. 主组件实现](#3-主组件实现)
- [4. Hooks 模块详解](#4-hooks-模块详解)
- [5. 数据流与状态管理](#5-数据流与状态管理)
- [6. 列配置双模式机制](#6-列配置双模式机制)
- [7. 渲染流程](#7-渲染流程)
- [8. 性能优化策略](#8-性能优化策略)
- [9. 关键设计模式](#9-关键设计模式)

---

## 1. 架构概览

### 1.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         Table 主组件                              │
│                       (table.tsx)                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │  useLayout  │  │  useRender  │  │ usePagination│               │
│  │  (布局管理)  │  │  (渲染逻辑)  │  │   (分页)    │               │
│  └─────────────┘  └─────────────┘  └─────────────┘               │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │ useColumns  │  │   useRows   │  │useFixedColumn│              │
│  │  (列管理)   │  │  (行管理)   │  │  (固定列)   │               │
│  └─────────────┘  └─────────────┘  └─────────────┘               │
│                                                                   │
│  ┌─────────────────────────────────────────────────────┐         │
│  │                 列配置双模式机制                       │         │
│  │  ┌──────────────────┐  ┌──────────────────┐          │         │
│  │  │ useColumnRegistry│  │useColumnTemplate │          │         │
│  │  │   (增量更新)     │  │   (全量解析)     │          │         │
│  │  └──────────────────┘  └──────────────────┘          │         │
│  └─────────────────────────────────────────────────────┘         │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                         Components                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │TableColumn│ │ TableRow │  │ TableCell│  │BodyEmpty │         │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                          Plugins                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                        │
│  │ HeadSort │  │HeadFilter│  │ Settings │                        │
│  └──────────┘  └──────────┘  └──────────┘                        │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                     VirtualRender (虚拟滚动)                       │
│                    @bkui-vue/virtual-render                       │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 核心设计原则

1. **模块化设计**：功能拆分到独立的 Hooks，职责单一
2. **双模式列定义**：支持配置式（`props.columns`）和模板式（`<TableColumn>`）
3. **增量更新机制**：通过列注册表避免全量解析，提升性能
4. **响应式状态管理**：使用 Vue 3 响应式 API 管理状态
5. **虚拟滚动支持**：集成 VirtualRender 组件处理大数据量

---

## 2. 核心文件结构

```
packages/table/
├── src/
│   ├── index.ts                    # 入口文件，导出 BkTable 和 BkTableColumn
│   ├── table.tsx                   # 主组件
│   ├── props.ts                    # Props 定义和类型
│   ├── const.ts                    # 常量定义
│   ├── events.ts                   # 事件类型定义
│   ├── utils.tsx                   # 工具函数
│   ├── cache.ts                    # 缓存类
│   │
│   ├── components/                 # 子组件
│   │   ├── table-column.tsx        # TableColumn 组件
│   │   ├── table-row.tsx           # TableRow 行容器
│   │   ├── table-cell.tsx          # TableCell 单元格
│   │   ├── body-empty.tsx          # 空数据展示
│   │   └── ghost-body.tsx          # 隐藏容器（模板解析）
│   │
│   ├── hooks/                      # Hooks 模块
│   │   ├── use-columns.tsx         # 列管理核心
│   │   ├── use-column-registry.tsx # 列注册表（增量更新）
│   │   ├── use-column-template.tsx # 列模板解析（降级方案）
│   │   ├── use-column-resize.tsx   # 列宽拖拽调整
│   │   ├── use-rows.tsx            # 行数据管理
│   │   ├── use-render.tsx          # 渲染逻辑
│   │   ├── use-head.tsx            # 表头渲染
│   │   ├── use-cell.tsx            # 单元格渲染
│   │   ├── use-layout.tsx          # 布局管理
│   │   ├── use-fixed-column.tsx    # 固定列处理
│   │   ├── use-pagination.tsx      # 分页
│   │   ├── use-settings.tsx        # 设置功能
│   │   ├── use-draggable.tsx       # 行拖拽排序
│   │   ├── use-shift-key.tsx       # Shift 多选
│   │   ├── use-observer-resize.tsx # 尺寸监听
│   │   └── use-scroll-loading.tsx  # 滚动加载
│   │
│   ├── plugins/                    # 插件
│   │   ├── head-sort.tsx           # 排序插件
│   │   ├── head-filter.tsx         # 过滤插件
│   │   └── common.ts               # 通用工具
│   │
│   └── table.less                  # 样式文件
```

---

## 3. 主组件实现

### 3.1 Table 组件入口 (table.tsx)

```typescript
// 核心结构
export default defineComponent({
  name: 'Table',
  props: tableProps,
  emits: EMIT_EVENT_TYPES,
  setup(props, ctx) {
    // 1. 初始化各 Hooks
    const columns = useColumns(props);      // 列管理
    const rows = useRows(props);            // 行管理
    const pagination = usePagination(props); // 分页
    const layout = useLayout(props, ctx);   // 布局
    
    // 2. 创建列注册表
    const columnRegistry = useColumnRegistry();
    
    // 3. 提供依赖注入
    provide(PROVIDE_KEY_INIT_COL, initTableColumns);
    provide(PROVIDE_KEY_COLUMN_REGISTRY, columnRegistry);
    
    // 4. 监听数据变化
    watch(() => props.data, ...);
    watch(() => columnRegistry.version.value, ...);
    
    // 5. 暴露方法
    ctx.expose({ setRowExpand, clearSelection, ... });
    
    // 6. 渲染
    return () => renderContainer([
      renderHeader(...),
      renderBody(...),
      renderFooter(...)
    ]);
  }
});
```

### 3.2 数据处理流程

```
props.data 变化
     │
     ▼
rows.setTableRowList()          # 设置全量数据
     │
     ▼
filteredAndSortedList (computed) # 过滤 + 排序
     │
     ▼
getRenderRowList()               # 分页切片
     │
     ▼
rows.setPageRowList()            # 设置当前页数据
     │
     ▼
renderTBody(pageRowList)         # 渲染表格体
```

---

## 4. Hooks 模块详解

### 4.1 useColumns - 列管理核心

**职责**：管理列配置、列宽计算、排序过滤状态

```typescript
const useColumns = (props) => {
  // 状态存储
  const tableColumnSchema = reactive(new WeakMap()); // 列属性映射
  const tableColumnList = reactive([]);              // 列配置列表
  const sortColumns = reactive([]);                  // 排序列
  const filterColumns = reactive([]);                // 过滤列
  const columnGroup = reactive([]);                  // 多级表头分组
  
  // 版本号机制（避免深度监听）
  const sortVersion = ref(0);
  const filterVersion = ref(0);
  const columnsVersion = ref(0);
  
  // 核心方法
  return {
    // 列配置处理
    debounceUpdateColumns,    // 防抖更新列
    flatColumnTemplate,       // 扁平化多级表头
    formatColumns,            // 格式化列配置
    
    // 列宽计算
    resolveColsCalcWidth,     // 计算列宽
    setColumnCalcWidth,       // 设置列宽
    
    // 排序/过滤
    setSortColumns,           // 设置排序
    setFilterColumns,         // 设置过滤
    
    // 属性访问
    getColumnAttribute,       // 获取列属性
    setColumnAttribute,       // 设置列属性
  };
};
```

**列宽计算算法**：

```
1. 遍历所有可见列，处理固定宽度（px 或 %）
2. 计算剩余宽度 = 容器宽度 - 已分配宽度
3. 将剩余宽度平均分配给自动宽度列
4. 应用最小宽度限制（默认 80px）
```

### 4.2 useColumnRegistry - 增量更新机制

**职责**：管理 TableColumn 组件的注册、更新、注销

```typescript
export default function useColumnRegistry(): ColumnRegistry {
  const columnMap = new Map<string, ColumnConfig>();
  const version = ref(0);
  
  // 注册新列
  const registerColumn = (id, config, parentId?) => {
    columnMap.set(id, { ...config, id, parentId, order: orderCounter++ });
    scheduleBatchUpdate();
  };
  
  // 更新列配置
  const updateColumn = (id, config) => {
    const existing = columnMap.get(id);
    columnMap.set(id, { ...existing, ...config });
    scheduleBatchUpdate();
  };
  
  // 注销列
  const unregisterColumn = (id) => {
    columnMap.delete(id);
    scheduleBatchUpdate();
  };
  
  // 批量更新（使用 requestAnimationFrame）
  const scheduleBatchUpdate = () => {
    requestAnimationFrame(() => {
      version.value++;
    });
  };
  
  // 构建嵌套列结构
  const getColumns = () => buildNestedColumns(Array.from(columnMap.values()));
  
  return { registerColumn, updateColumn, unregisterColumn, getColumns, version };
}
```

### 4.3 useRows - 行数据管理

**职责**：管理行数据、选择状态、展开状态

```typescript
const useRows = (props) => {
  const tableRowSchema = reactive(new WeakMap()); // 行属性映射
  const tableRowList = ref([]);                   // 全量数据
  const pageRowList = reactive([]);               // 当前页数据
  
  return {
    // 数据操作
    setTableRowList,          // 设置全量数据
    setPageRowList,           // 设置当前页数据
    
    // 选择操作
    toggleRowSelection,       // 切换行选中
    toggleAllSelection,       // 全选/取消全选
    setRowSelection,          // 设置行选中状态
    getRowSelection,          // 获取选中行
    
    // 展开操作
    setRowExpand,             // 设置行展开
    setAllRowExpand,          // 全部展开/收起
    
    // 属性访问
    getRowAttribute,          // 获取行属性
    setRowAttribute,          // 设置行属性
  };
};
```

**行数据 Schema 结构**：

```typescript
// 每行数据的内部属性（存储在 WeakMap 中）
{
  ROW_INDEX: number,        // 行索引
  ROW_UID: string,          // 唯一标识
  ROW_EXPAND: boolean,      // 是否展开
  ROW_SELECTION: boolean,   // 是否选中
  ROW_HEIGHT: number,       // 行高
}
```

### 4.4 useLayout - 布局管理

**职责**：管理表格容器、表头、表体的布局和样式

```typescript
export default (props, ctx) => {
  const refRoot = ref(null);    // 根容器
  const refHead = ref(null);    // 表头容器
  const refBody = ref(null);    // 表体容器（VirtualRender）
  
  const translateX = ref(0);    // 横向滚动位置
  const translateY = ref(0);    // 纵向滚动位置
  const bodyHeight = ref('auto'); // 表体高度
  
  return {
    // 渲染方法
    renderContainer,           // 渲染最外层容器
    renderHeader,              // 渲染表头
    renderBody,                // 渲染表体（集成虚拟滚动）
    renderFooter,              // 渲染表尾（分页）
    
    // 布局设置
    setBodyHeight,             // 设置表体高度
    setFootHeight,             // 设置表尾高度
    setTranslateX,             // 设置横向偏移
    setTranslateY,             // 设置纵向偏移
    setHeaderRowCount,         // 设置表头行数（多级表头）
  };
};
```

### 4.5 useRender - 渲染逻辑

**职责**：提供表格各部分的渲染函数

```typescript
export default ({ props, ctx, columns, rows, pagination }) => {
  // 渲染 colgroup（列宽控制）
  const renderColgroup = () => (
    <colgroup>
      {columns.visibleColumns.map(column => (
        <col style={{ width: getColumnWidth(column) }} />
      ))}
    </colgroup>
  );
  
  // 渲染表头
  const renderHeader = () => (
    <thead>
      {columns.columnGroup.map((cols, rowIndex) => (
        <tr>
          {cols.map((column, index) => {
            const { getTH } = useHead({ column, index, ... });
            return getTH();
          })}
        </tr>
      ))}
    </thead>
  );
  
  // 渲染表体行
  const renderRows = (dataList) => (
    <tbody>
      {dataList.map((row, rowIndex) => getRowRender(row, rowIndex, ...))}
    </tbody>
  );
  
  // 渲染分页
  const renderTFoot = () => (
    <Pagination {...pagination.options} />
  );
  
  return { renderColumns, renderTBody, renderTFoot };
};
```

### 4.6 useCell - 单元格渲染

**职责**：根据列类型渲染不同的单元格内容

```typescript
// 单元格渲染器工厂
export const createCellRenderer = (context) => {
  return (row, index, column, isChild) => {
    // 根据列类型分发渲染
    const renderFn = {
      expand: () => renderExpandColumn(),    // 展开列
      selection: () => renderCheckboxColumn(), // 选择列
      drag: () => renderDraggableCell(),      // 拖拽列
    };
    
    return renderFn[column.type]?.() ?? defaultFn();
  };
};

// 默认渲染逻辑
const defaultFn = () => {
  if (column.type === 'index') {
    return rows.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_INDEX);
  }
  
  if (typeof column.render === 'function') {
    return column.render({ cell, data, row, column, index, rows });
  }
  
  return getRowText(row, column.field);
};
```

### 4.7 useHead - 表头渲染

**职责**：渲染表头单元格，处理排序、过滤、全选

```typescript
export default ({ props, columns, rows, ctx, column, index }) => {
  // 排序点击处理
  const handleSortClick = (args) => {
    columns.setColumnAttribute(column, COLUMN_ATTRIBUTE.COL_SORT_TYPE, nextType);
    columns.setColumnSortActive(column, nextType !== SORT_OPTION.NULL);
    ctx.emit(EMIT_EVENTS.COLUMN_SORT, { column, index, type: nextType });
  };
  
  // 渲染排序图标
  const getSortCell = () => <HeadSort column={column} onChange={handleSortClick} />;
  
  // 渲染过滤下拉
  const getFilterCell = () => <HeadFilter column={column} onChange={handleFilterChange} />;
  
  // 渲染全选复选框
  const renderHeadCheckboxColumn = () => (
    <Checkbox
      modelValue={isChecked}
      indeterminate={indeterminate}
      onChange={handleChecked}
    />
  );
  
  // 返回表头单元格
  const getTH = () => (
    <th class={classList.value} style={headStyle}>
      {renderHeadCell()}
    </th>
  );
  
  return { getTH };
};
```

### 4.8 useFixedColumn - 固定列处理

**职责**：处理左右固定列的样式计算、阴影渲染

**文件位置**：`hooks/use-fixed-column.tsx`

#### 4.8.1 实现原理

```
┌─────────────────────────────────────────────────────────────┐
│                    固定列实现原理                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. CSS 定位策略                                              │
│     └─ 使用 position: sticky 实现固定效果                     │
│                                                               │
│  2. 左固定列计算（从左到右累加）                               │
│     ┌─────────────────────────────────────┐                  │
│     │ col1      │ col2      │ col3       │ ← 左固定         │
│     │ left: 0   │ left: w1  │ left: w1+w2│                  │
│     └─────────────────────────────────────┘                  │
│                                                               │
│  3. 右固定列计算（从右到左累加）                               │
│     ┌─────────────────────────────────────┐                  │
│     │ colN-2       │ colN-1    │ colN     │ ← 右固定         │
│     │ right: wN+wN-1│ right: wN │ right: 0│                  │
│     └─────────────────────────────────────┘                  │
│                                                               │
│  4. 阴影效果                                                  │
│     ├─ 通过 CSS 变量 --shadow-left, --shadow-right 控制       │
│     └─ 在 useLayout 中根据滚动位置动态设置                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

#### 4.8.2 核心代码

```typescript
export default function useFixedColumn(props, columns) {
  // 左固定列（fixed='left' 或 fixed=true）
  const fixedLeftColumns = computed(() =>
    columns.visibleColumns.filter(col => {
      const fixed = col.fixed;
      return fixed === true || fixed === 'left' || (fixed && fixed !== 'right');
    })
  );
  
  // 右固定列（fixed='right'）
  const fixedRightColumns = computed(() =>
    columns.visibleColumns.filter(col => col.fixed === 'right')
  );
  
  // 左/右固定区域总宽度
  const fixedLeftWidth = computed(() =>
    fixedLeftColumns.value.reduce((sum, col) => sum + columns.getColumnWidth(col), 0)
  );
  const fixedRightWidth = computed(() =>
    fixedRightColumns.value.reduce((sum, col) => sum + columns.getColumnWidth(col), 0)
  );
  
  // 阴影状态
  const shadowState = reactive({
    showLeftShadow: false,
    showRightShadow: true,
  });
  
  /**
   * 计算固定列样式
   * - 左固定：从左到右累加 left 偏移
   * - 右固定：从右到左累加 right 偏移
   */
  const resolveFixedColumnStyle = () => {
    // 右固定列（从右到左）
    let rightOffset = 0;
    for (let i = fixedRightColumns.value.length - 1; i >= 0; i--) {
      const col = fixedRightColumns.value[i];
      const width = columns.getColumnWidth(col) || 0;
      columns.setColumnRect(col, { right: rightOffset, width });
      columns.setFixedStyle(col, { right: `${rightOffset}px` });
      rightOffset += width;
    }
    
    // 左固定列（从左到右）
    let leftOffset = 0;
    fixedLeftColumns.value.forEach(col => {
      const width = columns.getColumnWidth(col) || 0;
      columns.setColumnRect(col, { left: leftOffset, width });
      columns.setFixedStyle(col, { left: `${leftOffset}px` });
      leftOffset += width;
    });
  };
  
  // 更新阴影状态
  const updateShadowState = (scrollLeft, scrollWidth, clientWidth) => {
    shadowState.showLeftShadow = scrollLeft > 0;
    shadowState.showRightShadow = scrollLeft + clientWidth < scrollWidth - 1;
  };
  
  // 渲染固定列阴影层
  const renderFixedRows = () => [renderFixedLeft(), renderFixedRight()];
  
  return {
    fixedLeftColumns,
    fixedRightColumns,
    fixedLeftWidth,
    fixedRightWidth,
    shadowState,
    resolveFixedColumnStyle,
    updateShadowState,
    renderFixedRows,
    isLastLeftFixed,      // 判断是否为最后一个左固定列
    isFirstRightFixed,    // 判断是否为第一个右固定列
    getFixedColumnClass,  // 获取固定列 class
  };
}
```

#### 4.8.3 列配置示例

```typescript
const columns = [
  { field: 'name', label: '姓名', fixed: 'left', width: 120 },   // 左固定
  { field: 'age', label: '年龄', fixed: true, width: 80 },       // 左固定（简写）
  { field: 'email', label: '邮箱' },                             // 普通列
  { field: 'address', label: '地址' },                           // 普通列
  { field: 'action', label: '操作', fixed: 'right', width: 100 }, // 右固定
];
```

#### 4.8.4 CSS 样式配置

```less
// 固定列基础样式
th, td {
  &.column_fixed {
    position: sticky;
    z-index: 1;
  }
}

// 表头固定列需要响应横向滚动
thead th.column_fixed {
  transform: translateX(var(--translate-x));
}

// 阴影层
.@{bk-prefix}-table-fixed {
  .column_fixed_right {
    box-shadow: var(--shadow-right);  // 右固定列左侧阴影
  }
  .column_fixed_left {
    box-shadow: var(--shadow-left);   // 左固定列右侧阴影
  }
}
```

#### 4.8.5 阴影控制流程

```
滚动事件 (useLayout.handleScrollChanged)
    │
    ▼
setTranslateX(scrollLeft)
    │
    ▼
setOffsetRight()  // 计算右侧剩余滚动距离
    │
    ▼
setFixedColumnShawdow()  // 根据滚动位置设置 CSS 变量
    │
    ├─ scrollLeft > 0
    │   └─ --shadow-left: '0 0 10px rgb(0 0 0 / 12%)'
    │
    └─ offsetRight > 0
        └─ --shadow-right: '0 0 10px rgb(0 0 0 / 12%)'
```

#### 4.8.6 返回值说明

| 属性/方法 | 类型 | 说明 |
|-----------|------|------|
| `fixedLeftColumns` | `Ref<Column[]>` | 左固定列列表 |
| `fixedRightColumns` | `Ref<Column[]>` | 右固定列列表 |
| `fixedLeftWidth` | `Ref<number>` | 左固定区域总宽度 |
| `fixedRightWidth` | `Ref<number>` | 右固定区域总宽度 |
| `shadowState` | `{ showLeftShadow, showRightShadow }` | 阴影显示状态 |
| `hasFixedColumns` | `Ref<boolean>` | 是否有固定列 |
| `resolveFixedColumnStyle` | `() => void` | 计算并更新固定列样式 |
| `updateShadowState` | `(scrollLeft, scrollWidth, clientWidth) => void` | 更新阴影状态 |
| `renderFixedRows` | `() => JSX.Element[]` | 渲染固定列阴影层 |
| `isLastLeftFixed` | `(column) => boolean` | 判断是否为最后一个左固定列 |
| `isFirstRightFixed` | `(column) => boolean` | 判断是否为第一个右固定列 |
| `getFixedColumnClass` | `(column) => Record<string, boolean>` | 获取固定列 class |

---

## 5. 数据流与状态管理

### 5.1 状态存储策略

```
┌─────────────────────────────────────────────────────┐
│                   状态存储策略                        │
├─────────────────────────────────────────────────────┤
│                                                       │
│  WeakMap 存储方案：                                   │
│  ┌─────────────────┐    ┌─────────────────┐          │
│  │tableColumnSchema│    │ tableRowSchema  │          │
│  │   (列 → 属性)   │    │   (行 → 属性)   │          │
│  └─────────────────┘    └─────────────────┘          │
│                                                       │
│  优势：                                               │
│  1. 不污染原始数据对象                                 │
│  2. 自动垃圾回收（对象销毁时属性自动清理）              │
│  3. 支持对象作为键，避免序列化开销                     │
│                                                       │
├─────────────────────────────────────────────────────┤
│                                                       │
│  版本号机制：                                         │
│  ┌─────────────────┐                                  │
│  │ sortVersion     │ ←── 排序状态变化时 +1            │
│  │ filterVersion   │ ←── 过滤状态变化时 +1            │
│  │ columnsVersion  │ ←── 列配置变化时 +1              │
│  └─────────────────┘                                  │
│                                                       │
│  用途：替代深度监听，提升性能                          │
│                                                       │
└─────────────────────────────────────────────────────┘
```

### 5.2 数据流向图

```
┌──────────────────────────────────────────────────────────────────┐
│                         数据流向                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Props 输入                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                         │
│  │  data    │  │ columns  │  │pagination│                         │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                         │
│       │             │             │                                │
│       ▼             ▼             ▼                                │
│  ┌──────────────────────────────────────┐                         │
│  │           Table 主组件               │                         │
│  │                                       │                         │
│  │  ┌─────────────┐  ┌─────────────┐    │                         │
│  │  │  useRows    │  │ useColumns  │    │                         │
│  │  │  (行状态)   │←→│  (列状态)   │    │                         │
│  │  └─────────────┘  └─────────────┘    │                         │
│  │         │                │           │                         │
│  │         ▼                ▼           │                         │
│  │  ┌──────────────────────────┐        │                         │
│  │  │  filteredAndSortedList   │        │                         │
│  │  │  (computed: 过滤+排序)   │        │                         │
│  │  └──────────────────────────┘        │                         │
│  │               │                      │                         │
│  │               ▼                      │                         │
│  │  ┌──────────────────────────┐        │                         │
│  │  │     pageRowList          │        │                         │
│  │  │   (当前页渲染数据)       │        │                         │
│  │  └──────────────────────────┘        │                         │
│  │               │                      │                         │
│  └───────────────┼──────────────────────┘                         │
│                  │                                                 │
│                  ▼                                                 │
│  ┌──────────────────────────────────────┐                         │
│  │         VirtualRender                 │                         │
│  │         (虚拟滚动渲染)                │                         │
│  └──────────────────────────────────────┘                         │
│                  │                                                 │
│                  ▼                                                 │
│  ┌──────────────────────────────────────┐                         │
│  │              DOM                      │                         │
│  └──────────────────────────────────────┘                         │
│                                                                    │
├──────────────────────────────────────────────────────────────────┤
│                         事件流向                                   │
│                                                                    │
│  DOM 事件 → 组件方法 → 状态更新 → emit 外部事件                    │
│                                                                    │
│  示例：行选择                                                      │
│  click → handleChecked → rows.setRowSelection → emit(ROW_SELECT)  │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 6. 列配置双模式机制

### 6.1 模式对比

| 特性 | 配置式 (props.columns) | 模板式 (<TableColumn>) |
|------|----------------------|----------------------|
| 使用方式 | 数组配置 | JSX/Template |
| 更新机制 | watch 监听 | 列注册表增量更新 |
| 性能 | 配置变化时全量更新 | 仅更新变化的列 |
| 适用场景 | 动态列配置 | 静态或少量动态列 |

### 6.2 配置式流程

```typescript
// 监听 props.columns 变化
watch(
  () => [props.columns],
  () => {
    if (props.columns?.length > 0) {
      columns.debounceUpdateColumns(props.columns, () => {
        setHeaderRowCount(columns.columnGroup.length);
      });
    }
  },
  { immediate: true }
);
```

### 6.3 模板式流程

```
┌───────────────────────────────────────────────────────────────┐
│                    模板式列配置流程                              │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Table 组件创建列注册表                                      │
│     const columnRegistry = useColumnRegistry();                 │
│     provide(PROVIDE_KEY_COLUMN_REGISTRY, columnRegistry);       │
│                                                                 │
│  2. TableColumn 组件注入注册表                                  │
│     const columnRegistry = inject(PROVIDE_KEY_COLUMN_REGISTRY); │
│                                                                 │
│  3. TableColumn mounted 时注册                                  │
│     onMounted(() => {                                           │
│       columnRegistry.registerColumn(columnId, config);          │
│     });                                                         │
│                                                                 │
│  4. TableColumn props 变化时更新                                │
│     watch(() => [...props], () => {                            │
│       columnRegistry.updateColumn(columnId, config);            │
│     });                                                         │
│                                                                 │
│  5. TableColumn unmounted 时注销                                │
│     onBeforeUnmount(() => {                                     │
│       columnRegistry.unregisterColumn(columnId);                │
│     });                                                         │
│                                                                 │
│  6. Table 监听注册表版本变化                                    │
│     watch(() => columnRegistry.version.value, () => {           │
│       const registryColumns = columnRegistry.getColumns();      │
│       columns.debounceUpdateColumns(registryColumns);           │
│     });                                                         │
│                                                                 │
└───────────────────────────────────────────────────────────────┘
```

### 6.4 降级机制

当列注册表不可用时，自动降级到 VNode 全量解析：

```typescript
// TableColumn 组件
if (useRegistryMode) {
  // 使用列注册表（增量更新）
  onMounted(() => columnRegistry.registerColumn(...));
  watch(() => [...props], () => columnRegistry.updateColumn(...));
  onBeforeUnmount(() => columnRegistry.unregisterColumn(...));
} else {
  // 降级模式：全量解析 VNode
  watch(() => [...props], () => initTableColumns());
}
```

---

## 7. 渲染流程

### 7.1 完整渲染流程

```
┌──────────────────────────────────────────────────────────────────┐
│                         渲染流程                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  renderContainer()                                                 │
│  ├── <div class="bk-table">                                       │
│  │                                                                │
│  │   renderHeader()                                               │
│  │   ├── <div class="bk-table-head">                              │
│  │   │   ├── renderColumns()                                      │
│  │   │   │   └── <table>                                          │
│  │   │   │       ├── renderColgroup()  ← 控制列宽                 │
│  │   │   │       └── <thead>                                      │
│  │   │   │           └── columnGroup.map() ← 多级表头              │
│  │   │   │               └── cols.map() → useHead().getTH()       │
│  │   │   │                                                        │
│  │   │   ├── <div class="col-resize-drag"/>  ← 拖拽线             │
│  │   │   ├── renderFixedRows()  ← 固定列阴影                      │
│  │   │   └── renderSettings()   ← 设置按钮                        │
│  │   │                                                            │
│  │   renderBody()                                                 │
│  │   ├── <VirtualRender>  ← 虚拟滚动包装                          │
│  │   │   ├── beforeContent: renderPrepend()                       │
│  │   │   ├── default: renderTBody()                               │
│  │   │   │   └── <table>                                          │
│  │   │   │       ├── renderColgroup()                             │
│  │   │   │       └── renderRows()                                 │
│  │   │   │           └── dataList.map()                           │
│  │   │   │               └── getRowRender()                       │
│  │   │   │                   └── <TableRow>                       │
│  │   │   │                       └── <tr>                         │
│  │   │   │                           └── columns.map()            │
│  │   │   │                               └── <td>                 │
│  │   │   │                                   └── <TableCell>      │
│  │   │   │                                       └── cellRenderer │
│  │   │   └── afterSection: [拖拽线, 固定列阴影]                   │
│  │   │                                                            │
│  │   renderFixedBottom()  ← 底部固定区域                          │
│  │   │                                                            │
│  │   renderFooter()                                               │
│  │   └── <div class="bk-table-footer">                            │
│  │       └── renderTFoot() → <Pagination>                         │
│  │                                                                │
│  └── <GhostBody>{slots.default}</GhostBody>  ← 模板解析容器       │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

### 7.2 单元格渲染分发

```typescript
// 根据列类型分发渲染
const renderFn = {
  // 展开列
  expand: () => (
    <span class="expand-btn-action" onClick={handleRowExpandClick}>
      {isExpand ? <DownShape/> : <RightShape/>}
    </span>
  ),
  
  // 选择列
  selection: () => (
    <Checkbox
      modelValue={isChecked}
      indeterminate={indeterminate}
      disabled={!isEnable}
      onChange={handleChecked}
    />
  ),
  
  // 拖拽列
  drag: () => <GragFill class="drag-cell" />,
  
  // 索引列
  index: () => rows.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_INDEX),
};

// 默认渲染
return renderFn[column.type]?.() ?? (
  column.render ? column.render({ cell, row, column, index }) : getRowText(row, column.field)
);
```

---

## 8. 性能优化策略

### 8.1 版本号机制

```typescript
// 避免深度监听，使用版本号追踪变化
const sortVersion = ref(0);
const filterVersion = ref(0);
const columnsVersion = ref(0);

// 状态变化时递增版本号
const setSortColumns = (col, sortOption) => {
  sortColumns.push({ col, ...sortOption });
  sortVersion.value++;  // 触发依赖更新
};

// 监听版本号而非深度监听数组
watch(() => columns.sortVersion.value, () => setTableData(false));
```

### 8.2 防抖更新

```typescript
// 列配置更新使用防抖（16ms，约一帧）
const debounceUpdateColumns = debounce(
  (columns, onComplete) => {
    // 检查配置是否真的变化
    const newHash = getColumnsHash(columns);
    if (newHash === lastColumnsHash) return;
    
    // 执行更新...
  },
  16,
  { leading: false, trailing: true }
);
```

### 8.3 批量渲染

```typescript
// 大数据量分批渲染
const batchPushRowList = (rowList) => {
  const size = 50;
  const batchPushItem = () => {
    pageRowList.push(...rowList.slice(startIndex, startIndex + size));
    if (endIndex < rowList.length) {
      setTimeout(batchPushItem);
    }
  };
  batchPushItem();
};
```

### 8.4 计算属性缓存

```typescript
// 使用 computed 缓存过滤和排序结果
const filteredAndSortedList = computed(() => {
  let renderList = rows.tableRowList.value.slice();
  
  // 应用过滤
  columns.filterColumns.forEach(item => {
    if (item.filterFn && item.filterValues?.length) {
      renderList = renderList.filter((row, index) => 
        item.filterFn(item.filterValues, row, index, props.data)
      );
    }
  });
  
  // 应用排序
  columns.sortColumns.forEach(item => {
    if (item.sortFn && item.active) {
      renderList.sort((a, b) => item.sortFn(a, b));
    }
  });
  
  return renderList;
});
```

### 8.5 虚拟滚动集成

```typescript
// 集成 VirtualRender 组件
<VirtualRender
  enabled={props.virtualEnabled}  // 开关
  lineHeight={lineHeight.value}    // 行高（支持固定或函数）
  list={list}                      // 数据列表
  rowKey={props.rowKey}            // 行唯一键
  throttleDelay={120}              // 滚动节流
  onContentScroll={handleScrollChanged}
>
  {{
    default: (scope) => renderTBody(scope.data)
  }}
</VirtualRender>
```

---

## 9. 关键设计模式

### 9.1 依赖注入模式

```typescript
// 父组件提供
provide(PROVIDE_KEY_COLUMN_REGISTRY, columnRegistry);
provide(PROVIDE_KEY_INIT_COL, initTableColumns);

// 子组件注入
const columnRegistry = inject(PROVIDE_KEY_COLUMN_REGISTRY);
const initTableColumns = inject(PROVIDE_KEY_INIT_COL);
```

### 9.2 组合式函数模式

```typescript
// 每个 Hook 返回相关功能的集合
const columns = useColumns(props);
const rows = useRows(props);
const layout = useLayout(props, ctx);
const pagination = usePagination(props);

// 组合使用
const { renderColumns, renderTBody, renderTFoot } = useRender({
  props, ctx, columns, rows, pagination
});
```

### 9.3 渲染器工厂模式

```typescript
// 创建可复用的渲染器
const cellRenderer = createCellRenderer({ props, rows, ctx, columns, multiShiftKey });

// 在渲染循环中使用（避免重复创建闭包）
columns.visibleColumns.map((column, index) => (
  <TableCell>
    {cellRenderer(row, rowIndex, column, isChild)}
  </TableCell>
));
```

### 9.4 事件代理模式

```typescript
// 表格事件代理
const handleRowClick = (e, row, index, rows) => {
  ctx.emit(EMIT_EVENTS.ROW_CLICK, e, row, index, rows);
};

const handleCellClick = (event, args) => {
  ctx.emit(EMIT_EVENTS.CELL_CLICK, args);
};
```

### 9.5 暴露 API 模式

```typescript
// 通过 expose 暴露组件方法
ctx.expose({
  setRowExpand: rows.setRowExpand,
  setAllRowExpand: rows.setAllRowExpand,
  clearSelection: () => {
    rows.clearSelection();
    columns.clearSelectionAll();
  },
  toggleAllSelection: rows.toggleAllSelection,
  toggleRowSelection: rows.toggleRowSelection,
  getSelection: rows.getRowSelection,
  setRowSelection: rows.setRowSelection,
  clearSort: columns.clearColumnSort,
  scrollTo,
  getRoot: () => refRoot.value,
  refreshData,
});
```

---

## 附录：常量定义

### A.1 行属性常量

```typescript
const TABLE_ROW_ATTRIBUTE = {
  ROW_INDEX: 'row_index',                    // 行索引
  ROW_UID: 'row_id',                         // 行唯一ID
  ROW_EXPAND: 'row_expand',                  // 展开状态
  ROW_SELECTION: 'row_selection',            // 选中状态
  ROW_SELECTION_INDETERMINATE: 'row_selection_indeterminate', // 半选状态
  ROW_HEIGHT: 'row_height',                  // 行高
};
```

### A.2 列属性常量

```typescript
const COLUMN_ATTRIBUTE = {
  COL_UID: 'col_$uuid',                      // 列唯一ID
  COL_MIN_WIDTH: 'col_min_width',            // 最小宽度
  COL_SORT_ACTIVE: 'col_sort_active',        // 排序激活
  COL_SORT_TYPE: 'col_sort_type',            // 排序类型
  COL_SORT_FN: 'col_sort_fn',                // 排序函数
  COL_FILTER_FN: 'col_filter_fn',            // 过滤函数
  COL_FILTER_VALUES: 'col_filter_values',    // 过滤值
  COL_IS_DRAG: 'col_is_drag',                // 是否拖拽中
  COL_FIXED_STYLE: 'col_fixed_style',        // 固定列样式
  COL_RECT: 'col_rect',                      // 列尺寸信息
  WIDTH: 'width',                            // 宽度
  CALC_WIDTH: 'calcWidth',                   // 计算宽度
  RESIZE_WIDTH: 'resizeWidth',               // 拖拽调整宽度
  IS_HIDDEN: 'isHidden',                     // 是否隐藏
  SELECTION_VAL: 'selection_val',            // 全选值
  SELECTION_INDETERMINATE: 'selection_indeterminate', // 全选半选
};
```

### A.3 排序选项

```typescript
const SORT_OPTION = {
  ASC: 'asc',      // 升序
  DESC: 'desc',    // 降序
  NULL: 'null',    // 无排序
  CUSTOM: 'custom' // 自定义
};
```

---

## 总结

BkTable 组件采用模块化的 Hooks 架构，将复杂的表格功能拆分为独立的可复用模块。通过版本号机制、防抖更新、计算属性缓存等策略优化性能。支持配置式和模板式两种列定义方式，并通过列注册表实现增量更新。集成 VirtualRender 组件支持大数据量虚拟滚动渲染。
