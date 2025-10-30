# Cascader 级联选择器

一个 Vue 3 组件，允许用户通过级联面板界面从分层数据结构中进行选择。

## 功能特性

### 面板插槽 (Panel Slot)

`Cascader` 组件现在支持面板级别的插槽，允许您自定义每个面板的内容。此功能对于向每个面板添加自定义标题或其他元素非常有用。

#### 用法

```vue
<template>
  <bk-cascader v-model="value" :list="data">
    <template #panel="{ nodes, level }">
      <div class="custom-panel-header">
        面板层级: {{ level }}, 节点数量: {{ nodes.length }}
      </div>
    </template>
  </bk-cascader>
</template>
```

#### 插槽作用域属性

`panel` 插槽提供以下属性：

-   `nodes`: 当前面板级别的节点数组。
-   `level`: 当前面板的从零开始的索引。
-   `activePath`: `cascader` 中的当前活动路径。

## 更新日志

### 2025-04-11

-   **修复：多选模式下面板展开不正确的问题 ([#2308](https://github.com/TencentBlueKing/bkui-vue3/issues/2308))**

    重构了面板展开逻辑，以区分初始加载和用户交互。现在，当用户选择一个节点时，只会展开相关的面板，防止其他面板受到影响，从而创造更可预测的用户体验。
