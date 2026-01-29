## 更新日志


### 2.0.2-beta.92

* **[feat]**:
    - 修复表格设置列无法checkbox无法选中的问题


### 2.0.2-beta.91

* **[feat]**:
    - bugfix(select): 修复 开启虚拟滚动在list有值时下拉为空问题


### 2.0.2-beta.89

* **[feat]**:
    - feature(sideslider): 新增拖动宽度配置
    - bugfix(input): search模式下search icon没有回调事件抛出
    - bugfix(select): 修复 select 单选自定义创建时无法清空输入框问题


### 2.0.2-beta.88

* **[feat]**:
    - bugfix(select): 点击Mask不关闭下拉面板


### 2.0.2-beta.87

* **[feat]**:
    - bugfix(tag): tag作为select下拉选项使用时无法被选中


### 2.0.2-beta.86

* **[feat]**:
    - bugfix(select): 点击遮罩关闭dialog，dialog内的select下拉面板销毁不干净


### 2.0.2-beta.85

* **[feat]**:
    - bugfix(tree): 设置show-checkbox后，selected值变化不会动态更新


### 2.0.2-beta.84

* **[feat]**:
    - bugfix(tag-input): 删除 tag 不符合预期


### 2.0.2-beta.83

* **[feat]**:
    - perf(tag-input): 优化 watch warn
    - feature(tree): 点击checkbox，希望不触发展开/收起


### 2.0.2-beta.82

* **[feat]**:
    - bugfix(select): 列表为空时，extension slot 失效
    - bugfix(select): 点击extension slot会导致下拉面板收起
    - bugfix(popover): hideIgnoreReference属性失效
    - feat(status-tag): 添加新的业务组件 status-tag & 国际化支持
    - fix(cascader): 修复光标位置问题
    - bugfix(select): 校验时报错的样式错误


### 2.0.2-beta.81

* **[feat]**:
    - fix(tree): 修复tree组件nodeContentAction配置在异步加载过程中展开收起支持的问题修复


### 2.0.2-beta.80

* **[feat]**:
    - feat(steps): 新增 disable 状态


### 2.0.2-beta.79

* **[feat]**:
    - bugfix(tree): 刷新tree列表后搜索异常
    - fix(popover): 修复renderDirective=show渲染问题


### 2.0.2-beta.77

* **[feat]**:
    - bugfix(select): 修复 select 搜索时loading 没有盖住下拉 & 快速输入时抖动问题
    - fix(message): 多个消息弹出时展开详情自动计算并更新弹出位置


### 2.0.2-beta.76

* **[feat]**:
    - bugfix(loading): 指令模式下与v-if合用存在遮罩异常


### 2.0.2-beta.75

* **[feat]**:
    - fix(popover): boundary默认值设置
    - feature(tag-input): 新增 copyable 配置支持复制，新增 copySeparator 配置复制内容的分隔符


### 2.0.2-beta.74

* **[feat]**:
    - bugfix(tooltip): 缺少防御性编码导致的报错


### 2.0.2-beta.73

* **[feat]**:
    - bugfix(select): select 分组模式搜索样式问题
    - feature(tree): checkbox模式下支持全局禁用


### 2.0.2-beta.72

* **[feat]**:
    - fix(popover): 修复弹出点击问题


### 2.0.2-beta.70

* **[feat]**:
    - bugfix(select): 多选模式下tag会显示+0


### 2.0.2-beta.69

* **[feat]**:
    - bugfix(form): 异步验证执行不正确
    - feature(crontab): 新增 crontab 组件
    - feature(alert): 可操作的文字按钮，需要是蓝色的字体


### 2.0.2-beta.68

* **[feat]**:
    - bugfix(date-picker): 范围选择器，开始时间从 23:59:59 开始，应该从 00:00:00 开始 ([#2476](https://github.com/TencentBlueKing/bkui-vue3/issues/2476))


### 2.0.2-beta.67

* **[feat]**:
    - bugfix(color-picker): 修复 transfer 属性配置为 true 不生效的问题


### 2.0.2-beta.66

* **[feat]**:
    - feat(tree): disableDrop参数优化


### 2.0.2-beta.65

* **[feat]**:
    - bugfix(tree): 拖拽排序功能替换节点位置不对


### 2.0.2-beta.64

* **[feat]**:
    - feature(tag-input): 单个项，双击可编辑
    - feature(navigation): 导航组件希望支持新的交互规范
    - bugfix(resize-layout): aside-bottom的时候把手位置异常
    - feature(search-select): 支持 copy 事件并回调可修改用户复制内容
    - fix: searchSelect getMenuList是异步的时候复制就不会触发这个get-menu-list方法


### 2.0.2-beta.63

* **[feat]**:
    - bugfix(input): 清空按钮样式问题


### 2.0.2-beta.61

* **[feat]**:
    - feature(pagination): 增加 slot


### 2.0.2-beta.60

* **[feat]**:
    - feat(date-picker): 处理 date-picker 组件选择快捷项后再选择时间清空或确认后再次打开，面板状态未重置


### 2.0.2-beta.59

* **[feat]**:
    - feat(date-picker): datePicker组件抛出面板切换事件
    - fix(transfer): 修复穿梭框multiple模式复选框宽度被挤压问题及列表样式优化
    - bugfix(pop-confirm): volar类型提示补全
    - fix(cascader): 修复多选/单选切换功能


### 2.0.2-beta.58

* **[feat]**:
    - bugfix(input): 设置最小值全选已填入的值按任意输入会回到最小值 ([#2426](https://github.com/TencentBlueKing/bkui-vue3/issues/2426))


### 2.0.2-beta.53

* **[feat]**:
    - feat(cascader): 新增 panel 插槽用于自定义面板内容
    - fix(dialog): 监听z-index变更更新弹出层层级


### 2.0.2-beta.52

* **[feat]**:
    - feature(cascader): 支持popoverOptions配置


### 2.0.2-beta.51

* **[feat]**:
    - feature(menu-group): group-name希望支持slot和hover效果


### 2.0.2-beta.50

* **[feat]**:
    - bugfix(timeline|tag-input): html 字符串编码问题
    - feature(select): search-change事件文档说明


### 2.0.2-beta.49

* **[feat]**:
    - 修复依赖导致打包的问题


### 2.0.2-beta.48

* **[feat]**:
    - feat(tab): Tab 选项卡增加props.beforeChange用于控制点击激活处理


### 2.0.2-beta.47

* **[feat]**:
    - feat(tab): Tab 选项卡增加props.beforeChange用于控制点击激活处理


### 2.0.2-beta.46

* **[feat]**:
    - feat(dialog): 重构拖拽位置实现，支持任意定位


### 2.0.2-beta.45

* **[feat]**:
    - feature: 日语国际化


### 2.0.2-beta.44

* **[feat]**:
    - feature: 日语国际化


### 2.0.2-beta.43

* **[feat]**:
    - fix: infobox不存在content或subTitle内容时会占位高度
    - bugfix(select): 自定义创建选项的下拉框（allow-create）input文本颜色不对


### 2.0.2-beta.42

* **[feat]**:
    - feature: 增加开关设置content或subTitle内容默认背景颜色


### 2.0.2-beta.41

* **[feat]**:
    - bugfix(input): type=number时手输数字会传出字符串后再传出Number类型


### 2.0.2-beta.40

* **[feat]**:
    - feat: bump to 2.0.2-beta.40，并优化搜索功能，修复关键字处理逻辑


### 2.0.2-beta.37

* **[feat]**:
    - bugfix(form): 自定义表单校验，validator 返回 number类型时通过 Boolean 转换判断结果 true/false


### 2.0.2-beta.36

* **[feat]**:
    - fix(cascader): 修复 tag 无法删除的问题


### 2.0.2-beta.35

* **[feat]**:
    - bugfix(cascader): 输入框失焦后会二次自动聚焦
    - fix(search-select): 修复 data-tips 属性逻辑，确保在非组合输入时正确显示占位符提示
    - feat(cascader): 新增 change-emits-nodes 属性以控制 change 事件返回节点数据


### 2.0.2-beta.33

* **[feat]**:
    - feat(cascader): 支持 extension 插槽


### 2.0.2-beta.32

* **[feat]**:
    - feature(dropdownMenu): default slot 改造成 scope slot 支持传递 popover 的收起展开状态
    - feat(form): bk-form-item 新增 item-type 配置项 TencentBlueKing#2375
    - feat: 优化输入框清空逻辑


### 2.0.2-beta.31

* **[feat]**:
    - bugfix(tree): 拖拽排序不生效


### 2.0.2-beta.30

* **[feat]**:
    - bugfix(input): type=number时手输数字会传出字符串后再传出Number类型
    - bugfix(taginput): 输入时的最大宽度应该是剩余容器宽度


### 2.0.2-beta.23

* **[feat]**:
    - bugfix(date-picker): disabledDate未正常限制日期与时间选择


### 2.0.2-beta.20

* **[feat]**:
    - bugfix(form-item): 添加 errorTipAppendToParent 属性以控制错误提示位置
    - fix(cascader): 修复removeTag时popover面板消失的问题，优化placeholder逻辑
    - fix(sideslider): 没有 footer 插槽时高度计算有误


### 2.0.2-beta.19

* **[feat]**:
    - bugfix(cascader): 级联组件支持数字空数据


### 2.0.2-beta.17

* **[feat]**:
    - bugfix(cascader): 当model-value为number类型的时候，支持传空的model-value


### 2.0.2-beta.13

* **[feat]**:
    - bugfix(cascader): list数据异步更新后交互异常
    - bugfix(tree): 拖拽交互异常
    - bugfix(message): code为空的时候，不要显示括号
    - bugfix(popover): 扩大点击占位区不收起弹出内容的支持范围


### 2.0.2-beta.12

* **[feat]**:
    - feature(input): Input组件透传tooltips配置项


### 2.0.2-beta.11

* **[feat]**:
    - bugfix(tree): tree树组件缩进问题&异步加载子节点触发事件配置支持


### 2.0.2-beta.10

* **[feat]**:
    - bugfix(slider): 兼容slider oldValue 为空的情况


### 2.0.2-beta.9

* **[feat]**:
    - bugfix(tree): tree树组件缩进问题


### 2.0.2-beta.7

* **[feat]**:
    - bugfix(cascader): 列表滚动条状态下，选中状态异常
    - bugfix(cascader): 清空状态不对，没有值的时候不应该显示


### 2.0.2-beta.6

* **[feat]**:
    - fix: 删除一些冗余代码


### 2.0.2-beta.5

* **[feat]**:
    - bugfix(pop-confirm): 支持抛出显示框显示/隐藏事件


### 2.0.2-beta.4

* **[feat]**:
    - feat(date-picker): date-picker组件缺少time-picker样式


### 2.0.2-beta.3

* **[feat]**:
    - feat(date-picker): date-picker组件缺少time-picker样式


### 2.0.2-beta.2

* **[feat]**:
    - feat: 优化组件构建


### 2.0.2-beta.1

* **[feat]**:
    - feat: 优化组件构建


### 2.0.1

* **[feat]**:
    - feat(modal): 最外层dom加上层级设置及ellipsis指令默认content优化


### 2.0.1-beta.113

* **[feat]**:
    - feat: 规范组件引入

### 2.0.1-beta.111

* **[feat]**:
    - fix(popover): 优化忽略占位区特性实现方式


### 2.0.1-beta.110

* **[feat]**:
    - fix(popover): 优化忽略占位区特性实现方式


### 2.0.1-beta.109

* **[feat]**:
    - feat: 修复样式变量构建错误问题


### 2.0.1-beta.108

* **[feat]**:
    - fix(popover): 暂时去除忽略占位特性


### 2.0.1-beta.105

* **[feat]**:
    - bugfix(date-picker): 日期和时间选择器支持手动设置聚焦


### 2.0.1-beta.104

* **[feat]**:
    - bugfix(select): 自定义创建时无法识别​数字小键盘上的Enter键
    - feat(search-select): 修复组件样式问题


### 2.0.1-beta.103

* **[feat]**:
    - fix(popover): 加hideIgnoreReference开关向下兼容使用旧版本的情况


### 2.0.1-beta.102

* **[feat]**:
    - fix(select): 适配 popover 新特性后的宽度问题
    - feat(select): select list 模式支持 disabled 属性


### 2.0.1-beta.101

* **[feat]**:
    - bugfix(select): fix: select组件-全选文案selectAllText属性设置不生效
    - bugfix(popover): HTML 结构问题 ([#2262](https://github.com/TencentBlueKing/bkui-vue3/issues/2262))
    - fix(search-select): 修复getMenuList获取展示问题
    - bugfix(popconfirm): 按钮支持bk-button的全部配置 ([#2253](https://github.com/TencentBlueKing/bkui-vue3/issues/2253))
    - feat(menu): 更新 menu-item 文档，添加 disabled 属性


### 2.0.1-beta.97

* **[feat]**:
    - bugfix(select): select组件option项失焦后hover效果还存在 ([#2260](https://github.com/TencentBlueKing/bkui-vue3/issues/2260))


### 2.0.1-beta.96

* **[feat]**:
    - bugfix(popover): 非manual模式下，支持点击占位区弹窗不自动收齐 ([#2254](https://github.com/TencentBlueKing/bkui-vue3/issues/2254))


### 2.0.1-beta.95

* **[feat]**:
    - feat(menu): add disabled state to menu items and improve styling([#2249](https://github.com/TencentBlueKing/bkui-vue3/issues/2249))
    - feat(notify): 优化文档 & message 支持Vnode #2246


### 2.0.1-beta.94

* **[feat]**:
    - bugfix(table): Table settings checkbox 文案超出会被遮挡([#2244](https://github.com/TencentBlueKing/bkui-vue3/issues/2244))


### 2.0.1-beta.93

* **[feat]**:
    - bugfix(menu): 折叠状态支持自定义分组标题([#2240](https://github.com/TencentBlueKing/bkui-vue3/issues/2240))


### 2.0.1-beta.92

* **[feat]**:
    - bugfix(popover): 鼠标从 popover 内容中移出时，内容不消失([#2233](https://github.com/TencentBlueKing/bkui-vue3/issues/2233))


### 2.0.1-beta.91

* **[feat]**:
    - bugfix(popover): 需要同时支持click和hover都能弹出面板([#2234](https://github.com/TencentBlueKing/bkui-vue3/issues/2234))


### 2.0.1-beta.90

* **[feat]**:
    - bugfix(popover): 需要同时支持click和hover都能弹出面板([#2234](https://github.com/TencentBlueKing/bkui-vue3/issues/2234))


### 2.0.1-beta.89

* **[feat]**:
    - bugfix(popover): 收起面板后dom元素需要保留([#2230](https://github.com/TencentBlueKing/bkui-vue3/issues/2230))


### 2.0.1-beta.88

* **[feat]**:
    - bugfix(dropdown): 点击下拉选项后，下拉面板未自动收起([#2226](https://github.com/TencentBlueKing/bkui-vue3/issues/2226))


### 2.0.1-beta.87

* **[feat]**:
    - bugfix(pagination): 分页逻辑重复执行([#2223](https://github.com/TencentBlueKing/bkui-vue3/issues/2223))


### 2.0.1-beta.86

* **[feat]**:
    - feat(menu): sub-menu 支持 title slot([#2219](https://github.com/TencentBlueKing/bkui-vue3/issues/2219))
    - perf(datePicker|timePicker): 新增 blur,focus 事件([#2214](https://github.com/TencentBlueKing/bkui-vue3/issues/2214))
    - feat(table): table 组件下架提醒([#2220](https://github.com/TencentBlueKing/bkui-vue3/issues/2220))


### 2.0.1-beta.85

* **[feat]**:
    - feature(select): 【全部】选项文案需要支持自定义([#2212](https://github.com/TencentBlueKing/bkui-vue3/issues/2212))
    - feature: upload组件预览事件提供文件列表数据([#2203](https://github.com/TencentBlueKing/bkui-vue3/issues/2203))
    - fix: table设置固定右对齐默认有padding会导致header与内容区域无法左对齐([#2217](https://github.com/TencentBlueKing/bkui-vue3/issues/2217))


### 2.0.1-beta.84

* **[feat]**:
    - perf(datePicker|timePicker): 新增 blur,focus 事件
    - bugfix(timeline|container): 组件重复注册
    - bugfix(tagInput): 自定义标签支持配置字符中间存在空格


### 2.0.1-beta.83

* **[feat]**:
    - bugfix(collapse): modelValue设置为空时，面板无法收起


### 2.0.1-beta.82

* **[feat]**:
    - feature: upload组件picture模式增加预览效果
    - fix(search-select): 修复在vue@v3.5.x后展示问题


### 2.0.1-beta.80

* **[feat]**:
    - feat(select): 展开下拉项时支持不自动定位到当前选中项
    - feat(search-select): 修复 name 设置固定宽度文字会被遮挡问题


### 2.0.1-beta.79

* **[feat]**:
    - bugfix(select): 修复 select下拉框属性filterable里文档默认取值false，但是实际是开启搜索框的
    - bugfix(select): 修复全部交互回显不正确问题


### 2.0.1-beta.78

* **[feat]**:
    - bugfix(infobox): 多个 infobox 切换时内部状态需要重置


### 2.0.1-beta.77

* **[feat]**:
    - bugfix(tag-input): 去掉单选时不支持复制的限制


### 2.0.1-beta.76

* **[feat]**:
    - feat(cascader): 打开面板自动定位到选中位置
    - fix: tab组件添加ts规范处理泛型警告
    - feat(loading): 提供 directives 的暴露接口
    - feature(tooltips): tooltips指令暴露 modifiers 属性
    - fix: filter style fix


### 2.0.1-beta.75

* **[feat]**:
    - bugfix(select): 同时设置remote-method和scroll-end时，滚动条异常


### 2.0.1-beta.72

* **[feat]**:
    - fix(table): 修复chrome最新版本渲染问题


### 2.0.1-beta.71

* **[feat]**:
    - feat(search-select): 更新resize-detector依赖


### 2.0.1-beta.70

* **[feat]**:
    - feature: colorPicker支持初始化默认展开popover


### 2.0.1-beta.69

* **[feat]**:
    - fix: 修复upload组件下error事件的message提示object问题


### 2.0.1-beta.68

* **[feat]**:
    - bugfix(select): 修复select tag key没有设置问题
    - fix: searchSelect组件设置maxHeight不生效


### 2.0.1-beta.67

* **[feat]**:
    - fix(input): 自适应高度 autosize 异常
    - bugfix(table): 表头过滤弹窗期望默认支持 '超出...' 的规范
    - feature(upload): 支持error事件的错误信息返回的是上传接口返回的message信息


### 2.0.1-beta.66

* **[feat]**:
    - feat(table): 导出 setRowSelection 方法


### 2.0.1-beta.65

* **[feat]**:
    - feat(release-note): 增加版本日志组件文档页面
    - fix: resizeLayout组件initialDivide 和 min同时配置时，min优先级较低问题([#1804](https://github.com/TencentBlueKing/bkui-vue3/issues/1804))


### 2.0.1-beta.64

* **[fix]**:
    - fix: 下拉菜单靠近底部区域hover出来一下会消失([#1964](https://github.com/TencentBlueKing/bkui-vue3/issues/1964))
    - fix: select组件支持自定义创建时失焦会清空文本框的值且匹配tag后文本框输入的值也没有清空([#2095](https://github.com/TencentBlueKing/bkui-vue3/issues/2095))
    - fix: dialog组件设置transfer属性失效([#1673](https://github.com/TencentBlueKing/bkui-vue3/issues/1673))
    - fix: tagInput组件输入文本内容时空白区域较大([#2118](https://github.com/TencentBlueKing/bkui-vue3/issues/2118))
    - fix: 修复textarea组件自适应高度autosize异常 ([#2122](https://github.com/TencentBlueKing/bkui-vue3/issues/2122))


### 2.0.1-beta.63

* **[fix]**:
    - fix(table): 高度固定导致滚动问题


### 2.0.1-beta.62

* **[feat]**:
    - bugfix(select): select组件同时出现无数据与option
    - feature: tab组件支持配置数字和数字样式类型([#1811](https://github.com/TencentBlueKing/bkui-vue3/issues/1811))
    - feature: input 组组件 textarea 模式下，支持 clearable([#1456](https://github.com/TencentBlueKing/bkui-vue3/issues/1456))
    - fix: 点击行内radio或者checkbox组件时row-click事件会触发两次([#2104](https://github.com/TencentBlueKing/bkui-vue3/issues/2104))
    - fix: 下拉菜单靠近底部区域hover出来一下会消失([#1964](https://github.com/TencentBlueKing/bkui-vue3/issues/1964))


### 2.0.1-beta.61

* **[feat]**:
    - fix: 修复 taginput 中文输入退格删除 tag 问题


### 2.0.1-beta.60

* **[feat]**:
    - form-item, tag-input 小问题修复


### 2.0.1-beta.59

* **[feat]**:
    - bugfix(table): table问题合集


### 2.0.1-beta.58

* **[feat]**:
    - fix: timepicker组件使用键盘修改时间，视图层更改了，但是值没有变化([#1809](https://github.com/TencentBlueKing/bkui-vue3/issues/1809))
    - fix:datePicker组件选中时间与控件展示时间不一致([#2086](https://github.com/TencentBlueKing/bkui-vue3/issues/2086))
    - fix: 表格组件支持只显示表头区域的tooltips([#1833](https://github.com/TencentBlueKing/bkui-vue3/issues/1833))
    - fix: 表格筛选少于限制最大个数时，高度没有自动撑开([#2082](https://github.com/TencentBlueKing/bkui-vue3/issues/2082))
    - fix: 表头筛选组件label溢出时会导致checkbox宽度样式缩小
    - fix: textarea模式拖动宽度可以超出父级且内部输入框高度没有自适应([#1983](https://github.com/TencentBlueKing/bkui-vue3/issues/1983))
    - fix:小型分页下拉菜单点击不消失([#2090](https://github.com/TencentBlueKing/bkui-vue3/issues/2090))
    - fix: tooltip组件showOnInit配置项失效且会造成函数循环引用([#1523](https://github.com/TencentBlueKing/bkui-vue3/issues/1523))
    - feature: table组件表头筛选组件的筛选逻辑([#2048](https://github.com/TencentBlueKing/bkui-vue3/issues/2048))
    - feature: 编写限制文件类型上传demo([#1886](https://github.com/TencentBlueKing/bkui-vue3/issues/1886))


### 2.0.1-beta.57

* **[feat]**:
    - fix: 修复 taginput 中文输入退格删除 tag 问题


### 2.0.1-beta.56

* **[feat]**:
    - feat(table): 优化row-height计算逻辑


### 2.0.1-beta.55

* **[feat]**:
    - fix(table): 拖拽完毕抛出事件参数问题修复


### 2.0.1-beta.54

* **[feat]**:
    - fix(virtual-render): 修复lineHeight fn计算最后一行位置问题
    - feature: alert组件提供自定义icon插槽
    - feature(select): select需要支持手动控制下拉选项显示和隐藏逻辑


### 2.0.1-beta.53

* **[feat]**:
    - bugfix: date-picker，添加append-to-body属性，选择后需要点击两次才能关闭
    - bugfix: pagination，手动输入页码后点击上下页，页码未改变
    - message display: box => display: -webkit-box


### 2.0.1-beta.50

* **[feat]**:
    - bugfix: 修复column filter默认值回填问题


### 2.0.1-beta.49

* **[feat]**:
    - bugfix(tooltips): 修复tooltips前缀未生效


### 2.0.1-beta.48

* **[feat]**:
    - bugfix(tooltips): 修复tooltips前缀未生效


### 2.0.1-beta.45

* **[feat]**:
    - feat(table): 支持虚拟渲染自定义行高配置
    - bugfix(search-select): 删除搜索条件时， 始终选中第一个下拉选项
    - bugfix(select): 修复 virtualScrollRender slot失效问题
    - 前端 UI 库容器化相关能力支持


### 2.0.1-beta.44

* **[feat]**:
    - bugfix(table): 修复虚拟滚动下面fixed列位置偏移问题


### 2.0.1-beta.43

* **[feat]**:
    - fix(tree): 功能梳理&TS修复


### 2.0.1-beta.41

* **[feat]**:
    - feat(table): scrollbar优化


### 2.0.1-beta.40

* **[feat]**:
    - feat: TS定义导出 BkTableColumn, BkCollapse 配置


### 2.0.1-beta.39

* **[feat]**:
    - docs(tab|notify): 文档补全
    - bugfix(infobox): onCancel 配置不生效


### 2.0.1-beta.38

* **[feat]**:
    - feature(select): select tag模式下新增tagRender插槽 & tree模式优化


### 2.0.1-beta.37

* **[feat]**:
    - feat: prop.isEmptyCell 支持为空判定配置


### 2.0.1-beta.36

* **[feat]**:
    - bugfix: 修复lodash isEmpty判定number类型为true的问题


### 2.0.1-beta.35

* **[feat]**:
    - feat(tree): setSelect & setChecked 参数调整


### 2.0.1-beta.34

* **[feat]**:
    - feat(table｜tree)：table展开收起单元格tooltip提示禁用 & tree支持selected事件抛出 & tree check-strictly属性支持
    - feat(upload): 支持纯文件流上传
    - docs(rate): 文档补全
    - feature(select|resize): 完善select和resize文档


### 2.0.1-beta.33

* **[feat]**:
    - bugfix(select): 修复list模式下全选交互问题
    - feat(search-select): 去除 `/` 分割
    - feat(docs): progress/switcher/breadcrumb/overflow-title 文档优化
    - docs(tab|notify): 文档补全


### 2.0.1-beta.32

* **[feat]**:
    - bugfix(table): 多表头导致拖拽列错位问题
    - feature(docs): badge\collapse\tag\card\slider 文档优化
    - feat(search-select): 文档和代码优化


### 2.0.1-beta.31

* **[feat]**:
    - bugfix: table设置字段显示不生效问题


### 2.0.1-beta.30

* **[feat]**:
    - feature(alert|checkbox|pagination|radio|steps|dialog|form|menu|sideslider|tag-input): 补全文档
    - bugfix(sideslider): renderDirective配置成 if 时会报错
    - feat(table): 支持多表头功能
    - bugfix(select): 下拉框组件清空选项后，clear icon 没有消失，必须再点一次才会消失
    - feature(docs): affix\backtop\cascader\fixed-navbar\link 文档优化
    - docs: button\code-diff\input\loading 文档补齐
    - bugfix(table): 取消全选方法修复 & 文档补齐
    - feat(docs): grid\color-picker\date-picker\time-picker\divider\pop-confirm 文档补齐


### 2.0.1-beta.29

* **[feat]**:
    - bugfix(tree): 父级全选/半选状态错误


### 2.0.1-beta.28

* **[feat]**:
    - bugfix(table): 修复grid布局宽度计算无限触发问题 & 修复已知问题


### 2.0.1-beta.27

* **[feat]**:
    - bugfix: 修复subtree读取逻辑
    - feat(scroll-bar): 滚动条样式规范优化


### 2.0.1-beta.26

* **[feat]**:
    - bugfix(datepicker): 修复粘贴厚偶发值没有改变的问题


### 2.0.1-beta.25

* **[feat]**:
    - Hotfix/column render index


### 2.0.1-beta.24

* **[feat]**:
    - feat(table): 梳理 & 重构table渲染逻辑 & 样式优化


### 2.0.1-beta.23

* **[feat]**:
    - feature(select): suffix icon 支持自定义


### 2.0.1-beta.22

* **[feat]**:
    - bugfix(radio|checkbox): beforeChange问题修复


### 2.0.1-beta.21

* **[feat]**:
    - bugfix(select): 修复虚拟滚动下搜索卡顿问题


### 2.0.1-beta.20

* **[feat]**:
    - bugfix(radio|checkbox): beforeChange问题修复


### 2.0.1-beta.19

* **[feat]**:
    - bugfix(select): 修复select虚拟滚动底部空白问题 & 修改虚拟滚动 preloadItemCount 逻辑


### 2.0.1-beta.18

* **[feat]**:
    - bugfix(datepicker): 修复编辑后值没有改变的问题


### 2.0.1-beta.17

* **[feat]**:
    - bugfix(datetimepicker): 修复 range 时，切换下一月的问题


### 2.0.1-beta.16

* **[feat]**:
    - bugfix(datetimepicker): 选择下一年bug


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
