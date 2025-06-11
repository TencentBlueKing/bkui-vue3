# Cascader

## 2025-04-11 修复日志

### 问题描述

https://github.com/TencentBlueKing/bkui-vue3/issues/2308

### 问题根源

级联选择器在多选模式下有一个特殊设计：当用户选择一个节点时，需要显示该节点的子节点面板。问题出在每次用户选择后，会触发以下流程：

1. 用户点击节点 → 节点被选中 → 更新 `modelValue`
2. `modelValue` 更新触发 `watch` 回调 → 调用 `updateCheckValue` 函数
3. `updateCheckValue` 函数会调用 `expandByNodeList` 函数
4. 原始的 `expandByNodeList` 函数会尝试展开所有选中路径中最长的那个路径的所有节点

关键问题在于第4步：即使用户只是点击了节点B，函数也会重新展开所有已选中的节点（包括之前选中的节点A），这导致面板显示混乱。

### 修复方案的核心理念

彻底改变了 `expandByNodeList` 函数的工作方式，引入了两种不同的工作模式：

1. **初始加载模式**：组件第一次加载或重置时（`checkValue.value.length === 0`），需要展开所有选中路径
2. **用户交互模式**：用户点击节点时，只展开当前点击的节点，不影响其他面板

### 修复的关键代码解析

1. **区分场景**：
   ```typescript
   const isInitialLoad = checkValue.value.length === 0;
   if (isInitialLoad || !store.config.multiple) {
     // 初始加载或单选模式的逻辑
   }
   // 用户交互过程中的选择由nodeExpandHandler单独处理，这里不干预
   ```

2. **避免调用 `nodeExpandHandler`**：
   原代码中每次都调用 `nodeExpandHandler(node)`，这会触发重复展开。我们改为直接操作数据：
   ```typescript
   const expandNode = (node: INode) => {
     // 直接修改 menus.list 和 activePath，而不调用 nodeExpandHandler
   };
   ```

3. **精确控制展开层级**：
   ```typescript
   menus.list = menus.list.slice(0, level);
   activePath.value = activePath.value.slice(0, level - 1);
   
   if (node.children?.length) {
     if (menus.list.length === level) {
       menus.list.push(node.children);
       activePath.value.push(node);
     }
   }
   ```

4. **递归处理父节点**：
   ```typescript
   const expandParents = (node: INode) => {
     if (node.parent) {
       expandParents(node.parent);
     }
     expandNode(node);
   };
   ```

### 为什么这个修复有效

1. 用户交互时，我们不再干预面板展开，完全依赖用户点击触发的 `nodeExpandHandler`
2. 初始加载时，我们仍然会按照原来的需求展开所有节点
3. 不再反复调用 `nodeExpandHandler`，避免了控制台打印的重复日志和不必要的状态更新
4. 保持了单选模式的原有行为，只修改了多选模式的行为

