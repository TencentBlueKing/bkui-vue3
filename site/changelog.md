## 更新日志

### 2.0.1-beta.15

* **[feat]**:
    - feat: 新增version标识组件库版本信息


### 2.0.1-beta.14

* **[feat]**:
    - feat: 更新优化前端linter


### 2.0.1-beta.12

* **[feat]**:
    - bugfix: 修复fixed column border-color transparent


### 2.0.1-beta.11

* **[feat]**:
    - feat(tree): 提供方法getParentNode
    - bugfix(pop-confirm): placement 属性不生效，无法将其放在下方


### 2.0.1-beta.9

* **[feat]**:
    - 修复 Tree 组件部分样式无 prefix 设置的问题


### 2.0.1-beta.8

* **[feat]**:
    - 修复 Cascader, Tree 组件部分样式无 prefix 设置的问题

### 2.0.1-beta.7

* **[feat]**:
    - rate 组件样式合并为一份文件
    - 修复 TimePicker `injection "Symbol(time-picker)" not found` 警告信息


### 2.0.1-beta.6

* **[feat]**:
    - feat(table): 增加 checked prop配置说明 & is-selected-fn 完善参数 & 增加props.checked说明
    - 修复 Cascader, ColorPicker, Transfer, Upload, Tree 组件部分样式无 prefix 设置的问题


### 2.0.1-beta.5

* **[feat]**:
    - bugfix(dialog): 去掉多余的font-size 设置
    - feat(table): 支持click + click范围选择


### 2.0.1-beta.4

* **[feat]**:
    - feat: datepicker 支持年份范围选择


### 2.0.1-beta.3

* **[feat]**:
    - feature(select): select options高度支持自定义


### 2.0.1-beta.2

* **[feat]**:
    - merge


### 2.0.1-beta.1

* **[feat]**:
    - feat(search-select): 支持自定义面板功能
    - feat(table|tree): table支持shift多选 & tree增加checkStrictly
    - feat: 修复构建icon问题
    - feat(select): 去除滚动的动画
    - feat(slider): 增加label-click配置支持
    - feat(tree|radio): tree支持配置节点进入可视区域内回调&事件抛出 & radio支持配置beforeChange
    - feat(radio|table): 支持配置beforeChange & table修复column template渲染初始化

* **[fix]**:
    - bugfix: 修复scrollbar触摸板滑动X轴不生效
    - bugfix: overflow title计算文本溢出算法
    - fix: 修复scrollbar keepalive保持组件滚动状态

* **[update]**:
    - perf(dialog|sideslider|infobox): 代码调整
    - 恢复 sideslider extCls 属性



### 1.0.3-beta.68

* **[feat]**:
    - feat(functional-dependecy): 修复业务组件体验问题
    - bugfix(pop-confirm): title属性在有slot的时候失效 issue #1755


### 1.0.3-beta.67

* **[feat]**:
    - feature(select): 去除滚动的动画


### 1.0.3-beta.66

* **[feat]**:
    - feat(search-select): 支持自定义面板功能


### 1.0.3-beta.65

* **[feat]**:
    - bugfix(form): 验证规则配置为 pattern 全局匹配时，多次执行 pattern.test 需要重置 lastIndex


### 1.0.3-beta.64

* **[feat]**:
    - bugfix(select): 修复list模式下没有设置唯一Key的问题


### 1.0.3-beta.63

* **[feat]**:
    - bugfix(radio|checkbox): prop 同时支持 Boolean 和 String 时默认值解析不正确


### 1.0.3-beta.61

* **[feat]**:
    - feature(select): 简化样式 支持tag模式


### 1.0.3-beta.60

* **[feat]**:
    - feat(upload): 添加selectChange属性


### 1.0.3-beta.59

* **[feat]**:
    - feat(search-select): 新版search select组件


### 1.0.3-beta.58

* **[feat]**:
    - feature(select): 自动聚焦支持关闭


### 1.0.3-beta.56

* **[feat]**:
    - feat(search-select): 新版search select组件


### 1.0.3-beta.55

* **[feat]**:
    - feat(search-select): 优化search select组件交互


### 1.0.3-beta.54

* **[feat]**:
    - bugfix(dialog): 样式修复


### 1.0.3-beta.53

* **[feat]**:
    - bugfix(dialog): 样式修复


### 1.0.3-beta.52

* **[feat]**:
    - fix(datepicker): datepicker monthrange 支持 disabled-date


### 1.0.3-beta.51

* **[feat]**:
    - fix(datepicker): datepicker monthrange 支持 disabled-date


### 1.0.3-beta.50

* **[feat]**:
    - fix(timeline): 修复样式没有构建加载问题 #1724


### 1.0.3-beta.49

* **[feat]**:
    - bugfix(dialog): 样式修复


### 1.0.3-beta.48

* **[feat]**:
    - bugfix(pop-confirm): 与Select组件一起使用时，Change事件会导致整个pop-confirm一起关闭
    - bugfix(dialog): 样式修复


### 1.0.3-beta.47

* **[feat]**:
    - feat(table & modal): table row-key计算逻辑调整 & modal unmounted处理逻辑调整 & modal hidden delay设置 & table column node context获取逻辑判定


### 1.0.3-beta.46

* **[feat]**:
    - bugfix(dialog): 样式修复


### 1.0.3-beta.45

* **[feat]**:
    - feat(Timeline):Timeline组件的tag、content属性应支持VNode


### 1.0.3-beta.43

* **[feat]**:
    - feat(table & modal): table row-key计算逻辑调整 & modal unmounted处理逻辑调整 & modal hidden delay设置 & table column node context获取逻辑判定


### 1.0.3-beta.42

* **[feat]**:
    - bugfix(dialog): 样式修复
    - fix: 修复Dialog在shadowDom下表现异常


### 1.0.3-beta.41

* **[feat]**:
    - perf(timeline): 代码调整


### 1.0.3-beta.40

* **[feat]**:
    - perf(timeline): 代码调整
    - bugfix(infobox): 样式问题


### 1.0.3-beta.38

* **[feat]**:
    - feat: icon支持按需加载


### 1.0.3-beta.37

* **[feat]**:
    - fix(table): bk-table-column增加内置uniqueid设置为ctx属性


### 1.0.3-beta.36

* **[feat]**:
    - fix(table): bk-table-column增加内置UniqueId用于更新判定 & 修复自动排序问题 #1629


### 1.0.3-beta.35

* **[feat]**:
    - fix(date-picker): 日期、时间 icon 问题修复


### 1.0.3-beta.35

* **[feat]**:
    - fix(date-picker): 日期、时间 icon 问题修复


### 1.0.3-beta.33

* **[feat]**:
    - feat: 更新业务组件date-picker及去除全局before,after伪类box-sizing设置
    - fix(table): 兼容table-column嵌套渲染

### 1.0.3-beta.32

* **[feat]**:
    - fix(table): 动态获取children增加判定逻辑

### 1.0.3-beta.31

* **[feat]**:
    - fix(table): 动态获取children增加判定逻辑


### 1.0.3-beta.30

* **[feat]**:
    - fix(table): bk-table-column支持嵌套多层自定义父级组件


### 1.0.3-beta.29

* **[feat]**:
    - feat: 增加 Log Search 日志检索业务组件
    - bugfix(table): 修复默认开启select搜索功能导致分页组件问题


### 1.0.3-beta.25

* **[feat]**:
    - bugfix(dialog): 弹出样式问题修复


### 1.0.3-beta.24

* **[feat]**:
    - bugfix(dialog): 弹出样式问题修复


### 1.0.3-beta.23

* **[feat]**:
    - fix(table): bk-table-column支持嵌套多层自定义父级组件


### 1.0.3-beta.22

* **[feat]**:
    - bugfix(datepicker): 全屏模式下弹出位置不显示


### 1.0.3-beta.21

* **[feat]**:
    - bugfix(datepicker): 全屏模式下弹出位置不显示


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
