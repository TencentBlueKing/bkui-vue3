/*
* Tencent is pleased to support the open source community by making
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
*
* Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
*
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
*
* License for 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition):
*
* ---------------------------------------------------
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
* documentation files (the "Software"), to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
* to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of
* the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
* THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
* CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
* IN THE SOFTWARE.
*/

interface LANG {
  [langName: string]: string[];
}

const Menu: LANG = {
  'Menu组件， 为页面和功能提供导航的菜单列表。': [
    'Menu component, which provides a menu list for navigation of pages and functions.',
  ],
  Menu组件的基础用法: ['Basic usage of Menu components'],
  'Menu 属性': ['Menu Attributes'],
  'Menu 事件': ['Menu Events'],
  'SubMenu 事件': ['SubMenu Events'],
  'SubMenu 插槽': ['SubMenu Slots'],
  'MenuItem 属性': ['MenuItem Attributes'],
  'MenuItem 插槽': ['MenuItem Slots'],
  选中的menu的key: ['The key of the selected menu'],
  '打开的submenu key值': ['Open submenu key value'],
  是否唯一展开一个submenu: ['Whether to expand a submenu uniquely'],
  展开menu时触发: ['Triggered when the menu is expanded'],
  点击子项时触发: ['Triggered when a sub-item is clicked'],
  展开项发生变化时触发: ['Triggered when the expanded item changes'],
  选择项发生变化时触发: ['Triggered when the selection changes'],
  展开变化时触发事件: ['Trigger event when unfolding changes'],
  名称: ['Name'],
  'icon 插槽': ['icon slot'],
  是否展示Icon: ['Whether to display Icon'],
  '垂直菜单，子菜单内嵌在菜单区域。': ['Vertical menu with submenus embedded in the menu area.'],
  数字: ['Number'],
  QQ音乐: ['QQ Music'],
  QQ飞车: ['QQ Flying'],
  腾讯微视: ['Tencent Microvision'],
  腾讯视频: ['Tencent Video'],
  腾讯云: ['Tencent Cloud'],
  腾讯影业: ['Tencent Pictures'],
  腾讯新闻: ['Tencent News'],
  腾讯动漫: ['Tencent Animation'],
  腾讯电竞: ['Tencent E-sports'],
  微信: ['WeChat'],
  光子: ['Photon'],
  和平精英: ['Game for Peace'],
  黎明觉醒: ['Dawn awakening'],
  自由幻想: ['Free fantasy'],
  重返帝国: ['Return to the Empire'],
  欢乐斗地主: ['Fight the landlord with joy'],
  天美: ['Tianmei'],
  王者荣耀: ['Glory of Kings'],
  天天酷跑: ['Cool running every day'],
  微众银行: ['WeBank'],
  腾讯体育: ['Tencent Sports'],
  腾讯看点: ['Tencent Highlights'],
  内容: ['Content'],
  阅文集团: ['Reading Group'],
};

const Navigation: LANG = {
  'Navigation组件， 为应用提供导航的整体布局。': [
    'Navigation component, which provides the overall layout of navigation for the application.',
  ],
  点击下面按钮可以切换不同的导航风格: ['Click the button below to switch different navigation styles'],
  通过属性配置切换不同的导航风格: ['Switch different navigation styles through property configuration'],
  左右结构: ['Left-right structure'],
  上下结构: ['Upper and lower structure'],
  这里是头部导航: ['Here is the head navigation'],
  这里填写内容: ['Fill in here'],
  监控平台: ['Monitoring platform'],
  初始左侧折叠导航的宽度: ['Width of initial left fold navigation'],
  展开左侧导航的宽度: ['Expand the width of the left navigatioN'],
  左侧导航的主标题: ['Main title of the left navigation'],
  头部导航条的标题: ['Title of the header navigation bar'],
  左侧栏hover离开后折叠的延迟时长: ['The delay length of folding after hover leaves the left column'],
  左侧栏hover进入后展开的延迟时长: ['Delay length of expansion after hover entry in the left column'],
  左侧栏初始状态: ['Initial status of the left column'],
  是否显示左侧导航: ['Whether to display left navigation'],
  '导航风格 （left-right: 左右导航风格 top-bottom: 上下导航风格）': [
    'Navigation style (left right: left right navigation style top bottom: up and down navigation style)',
  ],
};

const FixedNavbar: LANG = {
  'FixedNavbar 悬浮导航组件，快速设置右侧悬浮面板': [
    'FixedNavbar floating navigation component, quickly set the right floating panel',
  ],
  悬浮导航在右侧展示: ['The floating navigation is shown on the right'],
  'FixedNavbar 属性': ['FixedNavbar Attributes'],
  'NavItems 属性': ['NavItems Attributes'],
  需要固定展示的元素: ['Elements requiring fixed display'],
  '位置，可以分别设置为上、中、下的位置': [
    'The position can be set to the upper, middle and lower positions respectively',
  ],
  自定义样式: ['Custom style'],
  元素的icon: ['Element icon'],
  元素的显示的文字: ['The displayed text of the element'],
  元素点击的回调函数: ['Callback function of element click'],
  用于自定义鼠标悬浮内容的配置: ['Configuration for customizing mouse hover content'],
  联系: ['Contact'],
  可以通过腾讯蓝鲸QQ联系我们: ['You can contact us through Tencent Blue King QQ'],
};

const BackTop: LANG = {
  'Backtop 回到顶部': ['BackTop '],
  'Backtop 回到页面顶部的操作按钮': ['Back to the action button at the top of the page'],
  '滚动页面，滚动条超过40px后，按钮会出现在右下角': [
    'Scroll the page. When the scroll bar exceeds 40px, the button will appear in the lower right corner',
  ],
  向下滚动以显示按钮: ['Scroll down to display buttons'],
  'Backtop 属性': ['Backtop Attributes'],
  '滚动多少px后，元素可见': ['After how many px is scrolled, the element is visible'],
  触发滚动的对象: ['Objects that trigger scrolling'],
  '控制其显示位置, 距离页面右边距': ['Control its display position, distance from the right margin of the page'],
  '控制其显示位置, 距离页面底部边距': ['Control its display position, distance from the bottom margin of the page'],
};

const Breadcrumb: LANG = {
  'Breadcrumb组件， 显示当前页面的路径，快速返回之前的任意页面': [
    'The breadcrumb component displays the path of the current page and quickly returns to any previous page',
  ],
  '垂直菜单，子菜单内嵌在菜单区域。': ['Vertical menu with submenus embedded in the menu area.'],
  '斜杠\'/\'': ['Slash \'/\''],
  字符分割: ['Character segmentation'],
  '通过自定义 字符串 如：> | / 分割。': ['Split through a custom string such as:>|/.'],
  '通过设置 BkBreadcrumbItem 的 to 属性添加跳转链接。': [
    'Add a jump link by setting the to property of BkBreadcrumbItem.',
  ],
  '通过设置 BkBreadcrumb 的 separator 属性设置分隔符，他可以是字符串或者是slot': [
    'Set the separator by setting the separator property of BkBreadcrumb. It can be a string or a slot',
  ],
  支持返回配置以及前置插槽: ['Support return configuration and front slot'],
  增加前置插槽快速返回: ['Add front slot for quick return'],
  '通过设置 BkBreadcrumb 的 back-router 属性（和router参数一样）添加返回跳转链接，也可以使用slot自定义返回区域的内容。':
    [
      'Add the return jump link by setting the back-router property of BkBreakcrumb (the same as the router parameter), or use slot to customize the content of the return area.',
    ],
  'Breadcrumb 属性': ['Breadcrumb Attributes'],
  '图标分隔符 class': ['Icon separator class'],
  '路由跳转对象，同 vue-router 的 to': ['The route jump object is the same as the to of the vue-router'],
  '开启backRouter并使用默认的icon跳转时，启用 replace 将不会向 history 添加新记录': [
    'When starting backRouter and using the default icon jump, enabling replace will not add new records to the history',
  ],
  'Breadcrumb 插槽': ['Breadcrumb Slots'],
  'Breadcrumb Item 属性': ['Breadcrumb Item Attributes'],
  默认插槽: ['Default slot'],
  分隔符插槽: ['Separator slot'],
  '在使用 to 进行路由跳转时，启用 replace 将不会向 history 添加新记录': [
    'When using to for route jump, enabling replace will not add new records to history',
  ],
  禁用状态和下划线: ['Disable status and underline'],
};

const Link: LANG = {
  文字链接主题色: ['Text link theme color'],
  这是默认: ['This is the default'],
  这是危险: ['This is dangerous'],
  这是警告: ['This is a warning'],
  这是成功: ['This is dangerous'],
  这是主要: ['This is the primary'],
  基础的文字链接用法: ['Basic text link usage'],
  '文字链接不可用状态，添加underline实现下划线': ['Text link is not available. Add underline to realize underline'],
  文字链接地址: ['Text link address'],
  是否禁用: ['Disabled or not'],
  是否显示下划线: ['Show underline or not'],
  'a标签的target属性，规定在何处打开链接文档': [
    'The target attribute of the a tag specifies where to open the linked document',
  ],
  'Link 属性': ['Link Attributes'],
  'Link 文字超链接': ['Link Text Hyperlink'],
  选项一: ['Option 1'],
};

const Steps: LANG = {
  Steps步骤条: ['Steps'],
  'Steps步骤条，用于步骤类的场景组件': ['Step bar, used for scene components of step class'],
  步骤1: ['Step 1'],
  步骤2: ['Step 2'],
  步骤3: ['Step 3'],
  步骤4: ['Step 4'],
  '不传值时：默认选中第一个节点，颜色为蓝鲸主题色': [
    'When no value is passed: the first node is selected by default, and the color is blue whale theme color',
  ],
  '可以使用 size 属性来定义尺寸，可接受 small': [
    'The size attribute can be used to define the size, and small is acceptable',
  ],
  设置主题: ['Set up themes'],
  '可以通过 theme 属性来定义主题': ['You can define the theme through the theme attribute'],
  可点击: ['Clickable'],
  '可以通过 controllable为true 属性来使组件每个步骤可点击': [
    'You can make each step of the component clickable by setting the controllable to true',
  ],
  垂直方向和实线: ['Vertical direction and solid line'],
  '可以通过 direction属性来设置组件排列方式，可接受horizontal，vertical，默认为horizontal。指定 line-type 值为 solid 显示为实线':
    [
      'The component arrangement method can be set through the direction attribute. It can accept horizontal and vertical, and the default is horizontal. Specify the line-type value as solid and display as solid line',
    ],
  错误和加载中状态: ['Error and loading status'],
  '使用 status 属性设置当前步骤状态为错误或加载中，分别对应 error、loading 值，清空则还原为默认状态': [
    'Use the status attribute to set the current step status as error or loading, which corresponds to error and loading values respectively. If it is cleared, it will revert to the default status',
  ],
  自定义步骤内容: ['Customize step content'],
  '配置 steps 参数，具体内容参考下方属性表格': [
    'Configure the steps parameter. Refer to the attribute table below for details',
  ],
  测试一: ['Test 1'],
  测试二: ['Test 2'],
  测试三: ['Test 3'],
  测试四: ['Test 4'],
  测试五: ['Test 5'],
  这是描述: ['This is the description'],
  这是描述2: ['This is description 2'],
  这是描述3: ['This is the description 3'],
  这是描述4: ['This is description 4'],
  这是描述5: ['This is description 5'],
  '组件步骤内容，有四个可选的key：title icon description status。': [
    'There are four optional keys for component step content: title icon description status.',
  ],
  '当前步骤的索引值，从 1 开始': ['Index value of the current step, starting from 1'],
  '步骤条方向，支持水平（horizontal）和竖直（vertical）两种方向': ['Step bar direction, horizontal and vertical'],
  '指定大小，目前支持普通（不设置）和小尺寸（small）': [
    'Specify the size, which currently supports normal (not set) and small size (small)',
  ],
  '指定当前步骤状态，不指定则为默认状态（是否完成）': [
    'Specify the current step status. If not specified, it will be the default status (complete or not)',
  ],
  步骤可否被控制前后跳转: ['Can the step be controlled to jump back and forth'],
  组件的主题色: ['Theme color of component'],
  '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-steps 上': [
    'Configure the custom style class name. The incoming class will be added to the DOM. bk-steps at the outermost layer of the component',
  ],
  '步骤切换前的钩子函数，支持异步函数': ['The hook function before step switching supports asynchronous functions'],
  当前步骤变化时的回调: ['Callback when the current step changes'],
  事件: ['Event'],
  '回调参数（变化后的步骤 index）': ['Callback parameters (step index after change)'],
};

const Process: LANG = {
  'Process 步骤': ['Process steps'],
  'Process 步骤组件': ['Process step components'],
  '默认配置list，配置 controllable 可控制 process 前后跳转': [
    'List is configured by default, and controllable can control the jump of process',
  ],
  loading状态: ['Loading status'],
  '在 list 数据源中配置, 设置status 为 loading': ['Configure in the list data source and set the status to loading'],
  '步骤状态、自定义icon配置': ['Step status, custom icon configuration'],
  '配置 steps 的不同状态, 使用 status 属性设置当前步骤状态，支持 default、done、loading、error。 同样也可以是用icon属性添加icon':
    [
      'Configure the different states of steps, use the status attribute to set the current step state, and support default, done, loading, and error. You can also add an icon with the icon attribute',
    ],
  'process 数据源': ['Process data source'],
  '循环 list 时，显示字段的 key 值': ['When cycling the list, the key value of the field is displayed'],
  当前步骤的索引值: ['Index value of the current step'],
  '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-process 上': [
    'Configure the custom style class name, and the incoming class will be added to the DOM. bk-process at the outermost layer of the component',
  ],
};

const TimeLine: LANG = {
  'Timeline 时间轴，用于时间轴的场景组件': ['Timeline timeline, scene components for timeline'],
  选择了: ['Selected'],
  一天前: ['One day ago'],
  由pony上线到蓝鲸市场: ['Go online from pony to blue whale market'],
  '默认配置 list，list 为必传。可根据具体的应用场景，灵活地配置 list.tag 和 list.content，可以将时间作为标题，也可以作为内容的一部分':
    [
      'The default configuration is list, which is mandatory. The list.tag and list.content can be flexibly configured according to the specific application scenario. The time can be used as the title or as a part of the content',
    ],
  '在 list 数据源中配置 size color filled 属性呈现不同状态。绿色代表成功/已完成，蓝色代表正在进行，红色代表错误/失败，黄色代表告警/暂停，灰色代表未开始。实心代表已完成。':
    [
      'Configure the size color filled attribute in the list data source to display different states. Green represents success/completion, blue represents ongoing, red represents error/failure, yellow represents alarm/pause, and gray represents not started. Solid represents completed.',
    ],
  'pony审批通过，并附“同意”': ['Approved by pony and attached with "agree"'],
  'tony审批通过，并附“同意”': ['Tony approved and attached with "agree"'],
  allen正在审批: ['Allen is approving'],
  'allen审批不通过，并附“不同意”': ['Allen failed to pass the examination and approval with "Disagree" attached'],
  allen暂停审批: ['Allen suspended approval'],
  自定义节点图标: ['Custom node icon'],
  '在 list 数据源中配置 icon 属性': ['Configure the icon attribute in the list data source'],
  节点样式可配置: ['Node style is configurable'],
  '在 list 数据源中配置 type 属性（值可取 defult, primary, warning, success, danger），默认为 defult': [
    'Configure the type attribute in the list data source (the value can be default, primary, warning, success, danger), and default is default',
  ],
  '可配置 HTML 模板': ['Configurable HTML template'],
  节点状态: ['Node status'],
  由: ['From '],
  上线到: [' go online to '],
  部署到: [' deploy to '],
  部署到生产环境并发布至应用市场: [' deploy to production environment and publish to application market'],
  蓝鲸市场: ['blue whale market'],
  应用市场: ['application market'],
  生产环境: ['production environment'],
  并发布至: [' and publish to '],
  部署到预发布环境: [' deploy to pre-release environment'],
  '对 list 数据源中的 content 属性配置正确的 HTML 模板内容(注意：你的站点上动态渲染的任意 HTML 可能会非常危险，因为它很容易导致 XSS 攻击)':
    [
      'Configure the correct HTML template content for the content attribute in the list data source (Note: Any HTML dynamically rendered on your site may be very dangerous because it is easy to cause XSS attacks)',
    ],
  '时间轴数据源（必传)': ['Timeline data source (required)'],
  是否需要边框: ['Whether border is required'],
  '标题（一般是时间标识）': ['Title (usually time identification)'],
  节点样式: ['Node style'],
  节点大小: ['Node size'],
  节点颜色: ['Node color'],
  '节点图标，可使用蓝鲸 ICON': ['Node icon, can use Blue Whale ICON'],
  '是否填充节点(实心)': ['Whether to fill nodes (solid)'],
  '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-timeline 上': [
    'Configure the custom style class name, and the incoming class will be added to the DOM. bk-timeline at the outermost layer of the component',
  ],
  相应点击项的数据data: ['Data of the corresponding clicked item'],
};

const ColorPicker: LANG = {
  '用于颜色选择，支持多种颜色格式，支持颜色预设。': [
    'It is used for color selection, supports multiple color formats, and supports color presets.',
  ],
  '使用 bk-color-picker 标签配置颜色选择器组件': [
    'Use the bk-color-picker tag to configure the color selector component',
  ],
  不同尺寸: ['Different sizes'],
  '选择器有三种尺寸：大、默认（中）、小。': ['There are three sizes of selectors: large, default (medium), and small.'],
  颜色预设: ['Color preset'],
  '当 recommend 属性为 true 时显示推荐的颜色预设，为 false 时关闭预设，也可传入数组自定义预设。': [
    'When the recommended attribute is true, the recommended color preset is displayed. When it is false, the preset is turned off. You can also pass in the array custom preset.',
  ],
  'BkColorPicker 属性': ['BkColorPicker Attributes'],
  'BkColorPicker 事件': ['BkColorPicker Events'],
  当前选择的RGB颜色值: ['The currently selected RGB color value'],
  '有三种尺寸：大、默认（中）、小。': ['There are three sizes: large, default (medium), and small.'],
  是否显示当前选择的RGB颜色值: ['Whether to display the currently selected RGB color value'],
  '控制颜色面板是否出现在 body 内': ['Control whether the color panel appears in the body'],
  是否只读: ['Read Only'],
  是否显示预设值: ['Whether to display preset values'],
  '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-color-picker 上': [
    'Configure the custom style class name, and the incoming class will be added to the DOM. bk-color-picker at the outermost layer of the component',
  ],
  当前选择的RGB颜色值变化时调用: ['Called when the currently selected RGB color value changes'],
};

const DatePicker: LANG = {
  日期选择器: ['Date Pickers'],
  '通过 v-model 或者 value 设置初始值': ['Set the initial value through v-model or value'],
  开启日期范围: ['Start date range'],
  '通过设置 type 属性为 daterange 来开启时间设置': ['Enable time setting by setting the type attribute to daterange'],
  选择日期范围: ['Select date range'],
  开启时间设置: ['Opening time setting'],
  '我是自定义 header': ['I am a custom header'],
  '我是自定义 footer': ['I am a custom footer'],
  '我是自定义 confirm': ['I am custom confirm'],
  切换日期时间: ['Switch date and time'],
  '通过设置 type 属性为 datetime 来开启时间设置': ['Enable time setting by setting the type attribute to datetime'],
  '可以通过 trigger slot 来增加自定义 trigger': ['You can add custom trigger through trigger slot'],
  '自定义 header': ['Custom header'],
  '自定义 footer': ['Custom footer'],
  '自定义 shortcuts': ['Customize shortcuts'],
  自定义插槽: ['Custom slot'],
  '自定义插槽 tsx 写法': ['Custom slot tsx writing'],
  展示方式: ['Display mode'],
  今天: ['today'],
  近7天: ['Nearly 7 days'],
  近15天: ['Nearly 15 days'],
  近30天: ['Nearly 30 days'],
  清除: ['Clear'],
  选择时间: ['Select time'],
};

const TimePicker: LANG = {
  时间选择器: ['Time selector'],
  开启时间范围: ['Opening time range'],
  '通过设置 type 属性为 timerange 来开启时间设置': [
    'Turn on the time setting by setting the type attribute to timerange',
  ],
  时: ['Hours'],
  分: ['minutes'],
  秒: ['seconds'],
  选择时间范围: ['Select time range'],
};

const Divider: LANG = {
  '分割线是一个呈线状的轻量化组件，起到分割、组织、细化的作用，用于有逻辑的组织元素内容和页面结构。': [
    'The split line is a linear lightweight component that plays the role of segmentation, organization and refinement, and is used to logically organize element content and page structure.',
  ],
  '基础分割线是没有文字的独立线条，又分为水平分割线和垂直分割线。': [
    'The split line is a linear lightweight component that plays the role of segmentation, organization and refinement, and is used to logically organize element content and page structure.',
  ],
  分割线: ['Divider'],
  ['第1段落']: ['Paragraph 1'],
  ['第2段落']: ['Paragraph 2'],
  ['第3段落']: ['Paragraph 3'],
  ['第4段落']: ['Paragraph 4'],
  ['第5段落']: ['Paragraph 5'],
};

const Tab: LANG = {
  '选项卡切换组件。': ['Tab switch components.'],
  任务报表: ['Task Report'],
  加速配置: ['Accelerated configuration'],
  历史版本: ['Historical version'],
  已归档加速任务: ['Archived acceleration task'],
  '垂直居左-基础样式': ['Vertical Left - Base Style'],
  '垂直居右-基础样式': ['Vertical Right - Base Style'],
  新标签页: ['New tab'],
  '基础的、简洁的标签页。': ['Basic and concise tabs.'],
  选项卡样式: ['Tab Style'],
  '通过配置 type 属性，设置选项卡样式。支持的属性有 card, border-card, unborder-card, vertical-card': [
    'Set the tab style by configuring the type attribute. Supported attributes include card, border-card, unborder-card, and vertical-card',
  ],
  '通过配置 tab-position 属性，设置选项卡位置。支持的属性有 left, right, top。当 tab-position 属性配置为 left 和 right 时，addable 属性以及 closable 属性无效。':
    [
      'Set the tab position by configuring the tab-position attribute. The supported attributes are left, right, and top. When the tab-position attribute is configured as left and right, the addable attribute and the closable attribute are invalid.',
    ],
  选项卡位置: ['Tab Location'],
  自定义选项卡内容: ['Customize tab content'],
  可增删的选项卡: ['Tabs that can be added or deleted'],
  '配置 addable 属性可动态添加选项卡；配置 closable 可以动态删除选项卡': [
    'Configure the addable attribute to dynamically add tabs; Configure closable to dynamically delete tabs',
  ],
  'sortType 为replace时，为交换位置；为jump时，为插入当前位置。bk-tab :sortable=“true” 。tab 可拖拽排序。bk-tab-panel :unsortable=“ture”,此选项不可排序':
    [
      'When sortType is replace, it is the exchange position; When it is jump, the current position is inserted. bk-tab :sortable=“true” 。 Tab can be dragged and sorted. Bk-tab-panel: unsertable="true", this option cannot be sorted',
    ],
  拖拽排序: ['Drag and sort'],
  '通过使用 slot 自定义选项卡内容': ['Customize tab content by using slot'],
  自定义内容: ['Custom content'],
  自定义标签: ['Custom label'],
  tsx用法: ['Tsx usage'],
  'tsx 写法': ['Tsx writing'],
  设置: ['Set up'],
  tab内容: ['Tab content'],
  'tab 属性': ['Tab Attributes'],
  'tab 事件': ['Tab Events'],
  'tab-Panel 属性': ['Tab-Panel Attributes'],
  '更改为：history': ['Change to: history'],
  卡片样式: ['Card style'],
  拖动: ['Drag'],
  排序: ['Sort'],
  slot用法: ['Slot usage'],
};


export default {
  ...Menu,
  ...Navigation,
  ...FixedNavbar,
  ...BackTop,
  ...Breadcrumb,
  ...Link,
  ...Steps,
  ...Process,
  ...TimeLine,
  ...ColorPicker,
  ...DatePicker,
  ...TimePicker,
  ...Divider,
  ...Tab,
};
