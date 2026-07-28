## Select 组件实现说明

本文件用于解释 `BkSelect`（下拉选择器）在本仓库中的核心逻辑实现、关键状态流转、以及 `Option / OptionGroup` 等子组件如何协同工作。

源码位置：

- `packages/select/src/index.ts`：导出与安装（`BkSelect.Option` / `BkSelect.Group`）
- `packages/select/src/select.tsx`：主组件实现
- `packages/select/src/option.tsx`：选项组件（注册、点击选择、搜索高亮）
- `packages/select/src/optionGroup.tsx`：分组组件（分组注册、折叠、搜索联动）
- `packages/select/src/selectTagInput.tsx`：多选 Tag 模式输入框与溢出折叠
- `packages/select/src/common.ts`：注入 key、注册表、Popover 宽度、搜索（本地/远程）辅助
- `packages/select/__test__/select.test.ts`：单测覆盖（开合、单/多选、分组、搜索、虚拟滚动、对象 value 等）

---

### 1. 对外导出结构（安装与子组件挂载）

`BkSelect` 通过 `withInstallProps` 将 `Option` 和 `OptionGroup` 作为静态属性挂载，方便使用：

- `BkSelect.Option`（别名 `BkOption`）
- `BkSelect.Group`（别名 `BkOptionGroup`）

对应实现：`packages/select/src/index.ts`

---

### 2. 主组件 `Select` 的核心职责

`packages/select/src/select.tsx` 的 `Select` 主要做三件事：

- **承载状态**：维护选中项、搜索关键字、Popover 展示、当前 hover/active 的 option 等
- **协调子组件**：通过 `provide(selectKey, ctx)` 暴露上下文，`Option/OptionGroup` 通过 `inject` 获取并回调
- **渲染与交互**：触发器输入框（Input 或 TagInput）、Popover 内容（搜索区、全选/全部、选项列表）、键盘事件与点击外部关闭

---

### 3. 关键数据结构与状态

#### 3.1 options 注册表（Options 模式）

`Select` 内部使用：

- `optionsMap: Map<PropertyKey, OptionInstanceType>`：由 `Option` 在 `onBeforeMount` 调用 `select.register()` 注册
- `options: computed([...optionsMap.values()].sort((a,b)=>a.order-b.order))`：用于渲染与各种计算（全选、键盘移动等）

`Option` 同时会向 `OptionGroup` 的注册表注册（若存在分组上下文），用于分组计数与折叠。

#### 3.2 list 模式数据

当传入 `props.list`（数组）时，`Select` 会：

- 用 `idKey/displayKey` 从 list 推导 `listMap`（value -> label）
- 用 `filterList` 作为“渲染列表”（本地搜索时会过滤 list；远程搜索时直接使用 list）

> 注意：Options 模式与 list 模式可以同时存在（Popover 内容中会同时渲染 `renderList()` 与默认 slot），因此 label 回显逻辑做了多重兜底（见 4.2）。

#### 3.3 selected（内部选中快照）

内部统一用：

- `selected: Ref<ISelected[]>`，其中 `ISelected = { value, label }`

并通过 `watch(modelValue, ...)` + `handleSetSelectedData()` 同步外部 `modelValue` 到内部 `selected`。

---

### 4. v-model 与回显（selected 如何从 modelValue 推导）

#### 4.1 同步入口：`handleSetSelectedData()`

逻辑要点：

- `modelValue` 是数组：按数组逐个生成 `{ value, label }`
- `modelValue` 是单值：
  - 若值为 truthy，或命中 `allowEmptyValues`（允许空值作为合法选项，例如 `0` / `''` 等），则生成单个 selected
  - 否则清空 selected

该函数会在这些时机被调用：

- `watch([optionsMap, list], ...)`：当 options/list 变化时，重新回显 label
- `watch(modelValue, { deep: true })`：外部 v-model 变化时，同步 selected，并可触发表单校验
- `emitChange()` 后：组件主动派发 v-model 时，会立即重新以 `modelValue` 为主重置内部 selected（避免内部状态漂移）

#### 4.2 label 推导优先级：`handleGetLabelByValue(value)`

按优先级从多处取 label：

1. Options 模式：`optionsMap.get(value)?.optionName`
2. list 模式：`listMap[value]`
3. selected 缓存：`selectedCacheMap[value]`（由当前 `selected` 归约得到，包含 “全部” 的特殊映射）
4. 兜底：`value` 本身

并处理一个关键兼容点：

- 当 `value` 是对象（引用类型）时，外部如果传入了“等值但不同引用”的对象，会用 `lodash/isEqual` 在 `optionsMap.keys()` 里找回真实 key，确保回显正确。

---

### 5. 选中与取消选中（Option 点击）

`Option` 点击后调用：`select.handleOptionSelected(optionInstance)`

核心分支：

- **公共前置**：
  - disabled / loading 会让 `Select` 整体不可操作：`isDisabled = disabled || loading`
  - 若存在 “全部选项”（`showAll` + `allOptionId`）并且当前 selected 里包含它，会先移除（避免和普通选项共存）

- **多选 multiple**：
  - 若已选中：从 `selected` 删除该 value，派发 `deselect`
  - 若未选中：push 到 `selected`，派发 `select`
  - 然后 `emitChange(selectedValues)`，并在部分模式下清空输入框（见 7.2）
  - 保持焦点 `focusInput()`，便于连续选择

- **单选**：
  - `selected` 直接替换为单个
  - `emitChange(value)` + 派发 `select`
  - 关闭 Popover（非 manual trigger）并触发 blur

---

### 6. Popover 开合、宽度与点击外部关闭

#### 6.1 Popover 状态

Popover 由 `usePopover()` 管理：

- `isPopoverShow`：显示状态
- `popperWidth`：宽度（取 trigger 宽度与 `popoverMinWidth` 的最大值）

Popover 本身使用 `trigger: 'manual'`，由 `Select` 显式控制 `showPopover/hidePopover/togglePopover`。

#### 6.2 trigger 模式

`props.trigger` 支持：

- `default`：允许组件内部点击触发器开合、点击外部关闭
- `manual`：组件内部不再自动 show/hide（仅通过外部控制 `showPopover/hidePopover`）

#### 6.3 clickoutside

Popover 的 `onClickoutside` 会走 `handleClickOutside`：

- 若点击目标在 trigger 内部：忽略
- 否则隐藏 Popover，并触发 blur 逻辑

#### 6.4 isPopoverShow 的副作用

`watch(isPopoverShow, ...)` 做了两件关键事：

- **打开时**：
  - 绑定 `document.keydown`（键盘上下/回退/回车逻辑）
  - 延迟 `focusInput()`、初始化 hover 的 option、滚动到选中项（非虚拟滚动且未禁用时）
  - 若启用虚拟滚动：重置虚拟列表渲染状态

- **关闭时**：
  - 根据 `keepSearchValue` 决定是否清空搜索
  - 移除 `document.keydown`

---

### 7. 输入框形态（单选/多选、tag、可搜索、可创建）

#### 7.1 触发器渲染：Input / TagInput

`renderTriggerInput()`：

- `multipleMode === 'tag'`：使用 `SelectTagInput`
- 其它：使用 `Input`

两者都通过 suffixIcon 处理右侧区域：

- loading：Spinner
- hover + 可清空：显示清空 icon（`Close`）
- 默认：下拉箭头（或 `suffix slot`）

#### 7.2 isInput（是否允许输入）

`isInput` 的真实含义是“trigger 区是否允许输入内容”，逻辑为：

- `(filterable && inputSearch && isPopoverShow) || allowCreate`

要点：

- `inputSearch` 为 true 时，只有 Popover 展开才允许在 trigger 里输入（更像 combobox）
- `allowCreate` 为 true 时，不依赖 Popover 展开状态也允许输入（用于创建自定义 option）

#### 7.3 allowCreate（创建自定义选项）

入口：`handleCreateCustomOption(val, keyboardEvent)`

逻辑要点：

- 仅当 `allowCreate` 且输入不为空时生效
- 如果 `filterable` 且输入能匹配现有 option（忽略大小写），直接选择该 option，不创建
- 若 `optionsMap` 已存在同名 value，则禁止创建
- 多选：push `{ value, label: value }` 并 `emitChange(array)`
- 单选：替换 selected 并 `emitChange(value)`，随后关闭 Popover（非 manual）

`handleInputChange` 会在输入为空时把 modelValue 重置为空（多选 -> `[]`，单选 -> `''`）。

---

### 8. 搜索（本地 / 远程 / 拼音 / 自定义过滤）

#### 8.1 搜索状态

由 `useRemoteSearch()` 统一管理：

- `searchValue`：下拉搜索框输入（`!inputSearch` 时在 content 内渲染）
- `customOptionName`：trigger 输入框输入（allowCreate / inputSearch 下使用）
- `curSearchValue = searchValue || customOptionName`：当前生效的关键字
- `searchLoading`：调用搜索方法时的 loading

并 `watch(curSearchValue)`：

- 置 `searchLoading=true`
- 执行 `method(curSearchValue)`
  - 远程：`remoteMethod`
  - 本地：`handleDefaultOptionSearch`
- finally：回调 `initActiveOptionValue()`（重置当前 hover）

此外 `watch(searchValue)` 会：

- 滚动容器回到顶部
- 清空 `activeOptionValue`
- 派发 `search-change`

#### 8.2 Options 模式本地过滤：`handleDefaultOptionSearch`

策略：

- 关键字为空：所有 `option.visible = true`
- 否则：对每个 option 设置 `option.visible = defaultSearchMethod(...)`

`defaultSearchMethod` 支持三种扩展：

- `filterOption(searchValue, optionData)`：用户自定义过滤（优先级最高）
- `searchWithPinyin`：拼音搜索（`pinyin.parse`）
  - 支持全拼包含、首字母串包含、以及原文大小写不敏感包含
- 兜底：普通字符串大小写不敏感包含

#### 8.3 搜索高亮

当 `highlightKeyword` 为 true 时，`Option` 会将命中关键词的片段包装为 `<span class="is-keyword">`（`transformNode()`）。

---

### 9. 全选 / 全部（仅多选）

#### 9.1 全选（select all）

开启条件：

- `multiple && showSelectAll && (!curSearchValue || !filterable)`

也就是：多选 + 开启全选 + 当前不处于搜索态。

状态：

- `isAllSelected`：基于“未禁用的 options”与当前 selected 对比得出

行为：`toggleSelectAll()`

- 已全选：清空 selected
- 未全选：把所有未禁用的 options + list 项合并去重后写入 selected

#### 9.2 全部（allOptionId）

开启条件：

- `multiple && showAll`

行为：`toggleAll()`

- 选中“全部”时：`selected = [{ value: allOptionId, label: t('all') }]`
- 再次点击：清空

并且在正常 option 被点击时，会先把 “全部” 从 selected 里移除，避免与具体项并存。

---

### 10. 键盘交互（非虚拟滚动）

`document.keydown` 在 Popover 展开时注册（虚拟滚动开启时直接 return，不处理键盘）。

支持：

- `ArrowUp / ArrowDown`：
  - 在 `availableOptions = options.filter(!disabled && visible)` 中循环移动
  - 如果目标不在 viewport，则 `scrollIntoView()`
  - 更新 `activeOptionValue`

- `Backspace`：
  - 仅多选、且不在下拉搜索输入框、且当前没有 customOptionName 时生效
  - 删除 `selected` 末尾一项并 `emitChange`

- `Enter`：
  - 若当前处于 allowCreate 输入态或在下拉搜索框有值，则不触发选择
  - 否则选择当前 `activeOptionValue` 对应 option

---

### 11. 虚拟滚动（list 模式）

当 `enableVirtualRender` 开启时：

- 仅对 `list` 渲染生效（`renderList()`）
- 只有当 `filterList.length * lineHeight > virtualHeight` 才真正启用（避免小数据集也走虚拟渲染）

关键参数：

- `virtualHeight = scrollHeight - 12 - (isShowSelectAll ? 32 : 0)`（扣除上下边距与全选行）
- `virtualLineHeight = 32`
- `preloadItemCount = ceil(virtualHeight / virtualLineHeight)`

开启时会跳过键盘逻辑（目前实现如此），并在每次打开 Popover 时 `virtualRenderRef.reset()`。

---

### 12. OptionGroup 分组逻辑

`OptionGroup` 做两件事：

- 向 `Select` 注册 group（`select.registerGroup(uid, proxy)`），用于 `Select` 判断是否存在分组（`isGroup`）
- `provide(optionGroupKey, groupCtx)`，让组内 `Option` 在 mount/unmount 时也注册到组内的 `optionsMap`

组 label 默认展示：`${label} (${当前组内 visible 的 option 数})`

搜索联动：

- `isVisible = props.visible && !select.isSearchEmpty`
- 即当“搜索结果为空”时，分组整体隐藏（避免只看到空分组标题）

折叠：

- `collapsible` + `collapse` 决定是否可折叠与初始状态
- 点击 label 切换 `groupCollapse`，并 `emit('update:collapse', ...)`

---

### 13. 事件派发与表单联动

`Select` emits：

- `update:modelValue` / `change`：由 `emitChange(val)` 统一派发（第二个参数会携带旧值）
- `toggle`：Popover 开合变化时派发
- `clear`：清空时派发
- `focus` / `blur`：内部焦点状态变化
- `select` / `deselect`：多选点击 option 的增删事件
- `tag-remove`：Tag 模式点击 Tag close
- `scroll-end`：滚动到底触发（用于外部做分页加载）
- `search-change`：搜索关键字变化

表单联动：

- `useFormItem()` 获取表单上下文
- `watch(modelValue)` 中当 `withValidate` 为 true 时，触发 `formItem.validate('change')`

---

### 14. 常见易踩点（实现选择）

- **options/list 与 slot 混用**：Popover 内容会同时渲染 `renderList()` 与默认 slot，回显 label 也因此做了多层兜底。
- **value 为对象**：通过 `isEqual` 找回 `optionsMap` 的真实 key，避免引用变化导致无法回显。
- **搜索与创建共用一套状态**：`curSearchValue = searchValue || customOptionName`，意味着 allowCreate 输入也会触发搜索流程（含 loading 与回调）。
- **虚拟滚动下键盘逻辑被短路**：`handleDocumentKeydown` 在虚拟滚动启用时直接 return（如果后续需要支持键盘，需要补齐“虚拟列表当前可见项”的定位逻辑）。

---

### 15. 虚拟滚动递归更新问题修复（Maximum recursive updates exceeded）

#### 15.1 问题根源

在启用虚拟滚动时，存在以下递归更新链路：

1. `isPopoverShow` 变化 → `searchValue = ''`
2. `watch(curSearchValue)` 触发 → 调用 `handleDefaultOptionSearch('')`
3. VirtualRender 的 `calcList` 重算 → Option 组件 mount/unmount
4. Option 的 `register/unregister` 修改 `optionsMap`
5. `watch([optionsMap, list])` 触发 → `handleSetSelectedData()` → 可能修改 `selected`
6. `watch(selected)` 触发 → `popoverRef.updatePopover()` → 回到步骤 3

#### 15.2 修复方案

**1. Option 添加 `skipRegister` prop**

虚拟滚动渲染的 Option 不应该注册到 `optionsMap`，因为它们只是"当前可见窗口的子集"：

```tsx
// option.tsx
props: {
  skipRegister: PropTypes.bool.def(false),
}

onBeforeMount(() => {
  if (props.skipRegister) return;
  select?.register(optionID.value, proxy);
});
```

**2. 虚拟滚动渲染时传递 `skipRegister={true}`**

```tsx
// select.tsx renderList()
<Option
  skipRegister={true}  // 虚拟滚动模式
  // ...
/>
```

**3. 修复空状态判断逻辑**

`isOptionsEmpty` 和 `isSearchEmpty` 需要兼顾 list 模式：

```typescript
const isOptionsEmpty = computed(() => {
  if (list.value.length > 0) return false;
  return !options.value.length;
});

const isSearchEmpty = computed(() => {
  if (list.value.length > 0) {
    return curSearchValue.value && filterList.value.length === 0;
  }
  return options.value.length && options.value.every(option => !option.visible);
});
```

**4. Popover 关闭时跳过搜索副作用**

```typescript
watch(searchValue, () => {
  if (!isPopoverShow.value) return;  // 关闭时跳过
  // ...
});

const handleDefaultOptionSearch = (searchValue: string) => {
  if (!isPopoverShow.value) return;  // 关闭时跳过
  // ...
};
```

**5. `handleSetSelectedData` 防重复写入**

```typescript
const setIfChanged = (nextSelected: ISelected[]) => {
  if (isEqual(nextSelected, selected.value)) return;
  selected.value = nextSelected;
};
```

**6. `filterList` 避免无意义的数组拷贝**

```typescript
const filterList = computed(() => {
  if (!keyword) return list.value;  // 空关键字返回原引用
  return list.value.filter(...);
});
```
