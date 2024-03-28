## 更新日志

### 1.0.3-beta.20

* **[feat]**:
    - bugfix(table): 修复表格获取数据的问题


### 1.0.3-beta.19

* **[feat]**:
    - bugfix(table): row data change error


### 1.0.3-beta.18

* **[feat]**:
    - bugfix(table): row data change error


### 1.0.3-beta.17

* **[feat]**:
    - bugfix(table): 表格列冻结后改变容器尺寸没有更新计算 & popover鼠标滑入滑出隐藏失效


### 1.0.3-beta.16

* **[feat]**:
    - bugfix(popover): 不显示时，DOM位置不变


### 1.0.3-beta.15

* **[feat]**:
    - bugfix(table): overflowTooltip显示innerHTML问题 & column template update error & filter computed render error


### 1.0.3-beta.14

* **[feat]**:
    - fix: 修复部分组件的dts引用问题
    - 【Form】输入字符上限后，增加tooltips提示


### 1.0.3-beta.13

* **[feat]**:
    - bugfix(table): showOverflowTooltip透传配置到popover失效


### 1.0.3-beta.12

* **[feat]**:
    - docs(table): 完善示例文档
    - feature(infobox): 确定时await函数时默认加上loading


### 1.0.3-beta.11

* **[feat]**:
    - feature(select): 优化全部和全选交互 & 支持拼音搜索 & 支持高亮关键字


### 1.0.3-beta.10

* **[feat]**:
    - feature(table): 行支持拖拽排序 & 拖拽过程样式完善

* **[fix]**:
    - fix: 修复构建时部分js没有去除ts类型问题
    - bugfix(table): rowspan fn 计算错误 & 列排序不生效


### 1.0.3-beta.7

* **[fix]**:
    - bugfix(table): toggleRowSelection失效


### 1.0.3-beta.4

* **[fix]**:
    - bugfix(pagination): 切换页码时显示错误
    - 修复按需加载引入reset样式


### 1.0.1

* **[fix]**:
    - bugfix(sideslider) 修复 before-close 执行两次的问题
    - modal 中 handleBeforeClose 的处理增加对 promise 的判断


### 1.0.0

* **[feat]**:
    - 新增业务组件文档
    - 默认支持按需加载（无需额外的 webpack、vite 插件）


### 0.0.3-beta.6

* **[fix]**:
    - bugfix(form): 表单 tooltips 最大宽度为 400，可通过覆盖样式来修改


### 0.0.3-beta.3

* **[fix]**:
    - bugfix(tree): selected 默认值错误
    - bugfix(doc): 文档示例代码报错
    - bugfix(tag-input): tag tips 显示问题
    - bugfix(collapse): 配置 list 时组件内部CollapsePanel content类型错误
    - bugfix(infobox): props 类型调整，dialog 渲染逻辑变更
    - bugfix(tab): 兼容tab tips 配置不存在的数据局


### 0.0.3-beta.2

* **[feat]**:
    - feat(table): 支持拖拽排序功能


### 0.0.3-beta.1

* **[fix]**:
    - bugfix(tag): 支持尺寸配置

* **[feat]**:
    - feat(tag-input): tooltips 展示被折叠的内容
