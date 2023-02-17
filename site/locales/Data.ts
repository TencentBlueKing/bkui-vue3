/*
import { Collapse } from '@bkui-vue/collapse';
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

const Badge: LANG = {
  'Badge 组件， 可以出现在任意 DOM 节点角上的数字或状态标记': [
    'Badge component, a number or status mark that can appear on the corner of any DOM node',
  ],
  组件显示的值: ['Value displayed by component'],
  用默认配置初始化组件: ['Initialize components with default configuration'],
  未读消息: ['Unread message'],
  数字: ['Number'],
  '不包裹任何元素，独立使用': ['Do not wrap any elements and use independently'],
  '可在不包裹任何元素情况下，独立使用 badge': ['Badge can be used independently without wrapping any elements'],
  无内容红点: ['No content red dot'],
  '配置参数 dot': ['Configuration parameter dot'],
  组件相对于其兄弟组件的位置: ['The position of the component relative to its sibling component'],
};

const Progress: LANG = {
  'Progress 进度条': ['Progress'],
  'Progress 属性': ['Progress Attributes'],
  'Progress 插槽': ['Progress Slot'],
  修改进度条主题: ['Modify progress bar subject'],
  'percent 是 0 到 100 之间的数值，提供 4 种主题，由 theme 属性来定义，可选的主题有 primary, warning, success, danger，默认为 primary, 由 color 属性来自定义颜色值。':
    [
      'Percent is a value between 0 and 100. It provides four themes, which are defined by the theme attribute. The optional themes are primary, warning, success, and danger. The default is primary, and the color value is defined by the color attribute.',
    ],
  大小设置: ['Size Setting'],
  '可以使用 size 属性来配置进度条的尺寸，可接受 small large，也可配置strokeWidth线宽': [
    'You can use the size attribute to configure the size of the progress bar, accept small size, and configure strokeWidth line width',
  ],
  进度条类型: ['Progress bar type'],
  可以自定义文案: ['You can customize the copy'],
  自定义过滤文案: ['Custom filter copy'],
  '配置自定义弧度，以实现多种形状': ['Configure custom radians to achieve multiple shapes'],
  '配置val字符显示长度，最大值建议英文不超过3个字母，中文不超过2个汉字': [
    'Configure the display length of val characters. The maximum value is recommended to be no more than 3 letters in English and no more than 2 Chinese characters in Chinese',
  ],
  '组件显示的最大值，当 count 超过 overflowCount，显示数字 +；仅当设置了 Number 类型的 count 值时生效': [
    'CThe maximum value displayed by the component. When the count exceeds the overflow count, the number+is displayed; Only takes effect when the count value of Number type is set',
  ],
  '是否仅显示小圆点；当设置 dot 为 true 时，count, icon, overflowCount 均会被忽略': [
    'Whether to display only small dots; When dot is set to true, count, icon, and overflow count will be ignored',
  ],
  是否显示组件: ['Show components or not'],
  '配置自定义样式类名，传入的类会被加在组件最外层的 DOM `.bk-badge-main` 上': [
    'Configure the custom style class name. The incoming class will be added to the outermost DOM \'. bk bag main\' of the component',
  ],
  进度值: ['Progress value'],
  动态值: ['Dynamic Value'],
  改变值: ['Change value'],
  '环形/仪表盘': ['Ring/Instrument Panel'],
  未开始: ['Not started'],
  文案内显: ['Text Display'],
  '通过改变 type 修改进度条形状， line 默认线性 circle 圆形 dashboard 仪表盘': [
    'Modify the shape of the progress bar by changing the type. Line defaults to a linear circle circular dashboard',
  ],
  '通过改变 percent 改变进度': ['Change the progress by changing the percentage'],
  '环形/仪表盘大小颜色配置': ['Ring/Instrument Cluster Size Color Configuration'],
  '通过改变 color 修改进度颜色，bgColor修改背景颜色 width 修改大小 strokeWidth修改线宽': [
    'Change the color to modify the progress color, bgColor to modify the background color width to modify the size strokeWidth to modify the line width',
  ],
  线性进度条主题色: ['Linear progress bar theme'],
  'Progress 组件可通过 show-text 来控制文案是否显示， 通过 text-inside 属性来将进度条描述置于进度条内部, titleStyle 属性来调整百分数显示的样式 format 过滤文案展示':
    [
      'The Progress component can control whether the text is displayed through show-text, place the progress bar description inside the progress bar through the text-inside attribute, and adjust the percentage display style through the titleStyle attribute',
    ],
  线性进度条大小: ['Linear progress bar size'],
  '环形/仪表盘进度条大小': ['Ring/dashboard progress bar size'],
  线宽: ['Line width'],
  仪表盘进度路径两端形状: ['Dashboard progress path shape at both ends'],
  线性进度条是否显示文字到进度条内: ['Whether the linear progress bar displays text in the progress bar'],
  是否显示文案: ['Show copy'],
  '环形/仪表盘路径颜色': ['Ring/Instrument cluster path color'],
  '环形/仪表盘背景颜色': ['Ring/Instrument cluster background color'],
  文案过滤回调方法: ['Copy filtering callback method'],
  精确到小数点位数: ['To the nearest decimal place'],
  设置文案样式: ['Set copywriting style'],
};

const Collapse: LANG = {
  方案成熟: ['Mature scheme'],
  动画开始前: ['Before Animation'],
  动画结束后: ['After the animation'],
  面板标题插槽: ['Panel title Slot'],
  面板头部插槽: ['Panel head Slot'],
  面板内容插槽: ['Panel content Slot'],
  是否使用手风琴模式: ['Whether to use accordion mode'],
  '可以配置参数 accordion 来确定是否使用手风琴模式': [
    'The parameter accordion can be configured to determine whether to use the accordion mode',
  ],
  '插槽：自定义面板标题': ['Slots: Custom panel titles'],
  '方案成熟 自定义title': ['Customized title for mature scheme'],
  '覆盖全面 自定义title': ['Overwrite comprehensive custom title'],
  '开放平台 自定义title': ['Open platform custom title'],
  '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维': [
    'With the experience of supporting hundreds of Tencent businesses, compatible with various complex system architectures, born in O&M and proficient in O&M',
  ],
  通过配置默认插槽即可自定义标题内容: ['You can customize the title content by configuring the default Slot'],
  自定义title: ['Custom Title'],
  点击事件: ['Click Event'],
  设置列表不可点击disabled: ['The Setting List Cannot be disabled'],
  '展开/收起 动画状态改变的回调事件': ['Expand/collapse the callback event of animation state change'],
  '插槽：面板': ['Slots: panels'],
  'collapse-panel单独使用': ['Collepse-panel used alone'],
  '传统用法，通过CollapsePanel配置内如': ['Traditional usage, such as'],
  '单个collapse-panel使用': ['Use of a single collapse-panel'],
  通过配置list字段disabled即可: ['You can configure the list field disabled'],
  '点击时触发，回调参数为点击的面板对象': [
    'Triggered when clicked. The callback parameter is the clicked panel object',
  ],
  '配置事件before-enter/after-leave': ['Configure event before-enter/after-leave'],
  tsx使用: ['Tsx use'],
  'Collapse 属性': ['Collapse Attributes'],
  'Collapse 插槽': ['Collapse Slot'],
  'Collapse-Panel 属性': ['CollapsePanel Attributes'],
  'CollapsePanel 插槽': ['CollapsePanel Slot'],
  '回调参数 name': ['Callback parameter name'],
  '回调参数（item）': ['Callback parameter (item)'],
  '配置内容隐藏方式，默认是 show，收起时，通过设置 display:none(v-show) 不显示在页面,if 为不渲染组件': [
    'Configure the content hiding method. The default is show. When it is collapsed, set display: none (v-show) to not display on the page. If is not a component to render',
  ],
  配置面板列表数据: ['Configure panel list data'],
  '当前面板是否这边(单独使用时才生效)': ['This side of the current panel (only effective when used alone)'],
  当前激活面板的key: ['The key of the currently active panel'],
  是否使用手风琴效果: ['Whether to use accordion effect'],
  '激活面板的唯一标识，不配置默认使用面板的index': [
    'The unique identifier of the active panel. The default index of the active panel is not configured',
  ],
  面板标题key值: ['Panel title key value'],
  面板内容key值: ['Panel content key value'],
  '唯一标识符，相当于 ID': ['Unique identifier, equivalent to ID'],
  面板标题: ['Panel Title'],
  面板内容: ['Panel Content'],
  当前点击: ['Current click'],
  '是否禁用当前面板，禁用后展开过的面板会自动折叠': [
    'Whether to disable the current panel. The expanded panel will automatically collapse after disabling',
  ],
  'child-1-方案成熟-拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维': [
    'Child-1 - mature solution - with experience in supporting hundreds of Tencent businesses, compatible with various complex system architectures, born in operation and maintenance, proficient in operation and maintenance',
  ],
  'child-1-覆盖全面': ['Child-1 - comprehensive coverage'],
  'child-1-方案成熟': ['Child-1 - mature scheme'],
  'child-1-开放平台': ['Child-1 - open platform'],
  默认配置: ['Default configuration'],
  随机数据: ['Random data'],
  '如果要禁用所有行为请设置为[],不要设置null|undefined之类，这类设置会被置换为默认配置': [
    'If you want to disable all behaviors, please set it to [], and do not set null | undefined and so on. Such settings will be replaced by the default configuration',
  ],
};

const AnimateNumber: LANG = {
  'AnimateNumber 动态数字': ['AnimateNumber'],
  动态数字组件: ['Dynamic digital component'],
  '通过 value 设置初始值, 通过 digits 设置小数位。': [
    'Set the initial value through value, and set the decimal places through digits.',
  ],
  'AnimateNumber 属性': ['AnimateNumber Attributes'],
  小数位: ['Decimal places'],
};

const Rate: LANG = {
  评分组件: ['Scoring component'],
  '通过 editable 设置为 false, 让 rate 组件只能查看不能编辑，只有非编辑态可以展示小数': [
    'Set editable to false, so that the rate component can only be viewed but not edited, and only non-editable can display decimals',
  ],
  控制组件大小: ['Control component size'],
  '通过 size 属性控制组件大小': ['Control component size'],
  '通过监听 change 事件来做出响应': ['Respond by listening for the change event'],
  'Rate 属性': ['Rate Attributes'],
  'Rate 事件': ['Rate Event'],
  分数: ['Score'],
  尺寸: ['Size'],
  是否可编辑: ['Editable or not'],
  评分发生变化的时候: ['When the score changes'],
};

const Swiper: LANG = {
  在多个面板之间切换: ['Switch between multiple panels'],
  '通过传递 pics 或者 list 属性，来直接展示图片。通过 loop-time 控制轮播间隔时间。通过 height 控制轮播图高度': [
    'The picture can be displayed directly by passing pics or list attributes. Control the rotation interval through loop-time. Control the rotation chart height through height',
  ],
  是否自动轮询: ['Whether to poll automatically'],
  自动轮询间隔时间: ['Automatic polling interval'],
  父元素高度: ['Parent element height'],
  父元素宽度: ['Parent element width'],
  '通过 Slot 自定义显示内容': ['Customize display content through Slot'],
  '通过传递 pics 或者 list 属性传递数据，通过 default 作用域插槽自定义显示内容': [
    'Transfer data by passing pics or list attributes, and customize display content through default scope slot',
  ],
  'Swiper 属性': ['Swiper Attributes'],
  'Swiper 事件': ['Swiper Event'],
  '图片列表，[{ link: String, url: String, color: String, class: String }]': [
    'Picture list, [{ link: String, url: String, color: String, class: String }]',
  ],
  '数据列表，配合 slot 使用': ['Data list, used with slot'],
  '轮播图高度，如果不传将使用父元素高度': [
    'The height of the rotation chart. If it is not transmitted, the height of the parent element will be used',
  ],
  '轮播图宽度，如果不传将使用父元素宽度': [
    'The width of the rotation chart. If it is not transmitted, the parent element width will be used',
  ],
  轮播索引发生变化时回调函数: ['Callback function when the rotation index changes'],
};

const Table: LANG = {
  'Table组件， 为页面和功能提供列表': ['Table component, providing lists for pages and functions'],
  '基础用法-模板方式调用': ['Basic usage - template method call'],
  设置边框: ['Set Border'],
  设置边框显示样式: ['Set border display style'],
  '启用虚拟滚动-渲染大数据表格': ['Enable virtual scrolling - render big data tables'],
  大数据模式启用虚拟滚动: ['Big data mode enables virtual scrolling'],
  Events: ['Events'],
  自定义Column渲染: ['Custom Column Rendering'],
  自定义过滤: ['Custom filter'],
  分页配置: ['Paging configuration'],
  Selection: ['Selection'],
  'Pagination - Local': ['Pagination - Local'],
  'Empty - 空数据提示': ['Empty - Empty data prompt'],
  'translate \'Selection': ['translate \'Selection'],
  'colspan & rowspan': ['colspan & rowspa'],
  固定列: ['Fixed column'],
  底部加载: ['Bottom loading'],
  配置底部加载更多: ['Load more at the bottom of the configuration'],
  底部加载插槽: ['Bottom loading slot'],
  '自定义配置底部加载更多,需要设置 scroll-loading = true': [
    'More loading is required at the bottom of the custom configuration. You need to set scroll-loading=true',
  ],
  折叠功能: ['Collapse function'],
  '基础用法-模板方式调用 bk-column': ['Basic usage - call bk-column in template mode'],
  'Pagination - Remote': ['Pagination - Remote'],
  '分页配置: remote-pagination = true': ['Paging configuration: remote-pagination=true'],
  '横纵内容过多时，可选择固定列': [
    'If there are too many horizontal and vertical contents, you can select fixed column',
  ],
  '自定义空数据-empty插槽': ['Custom empty data-empty slot'],
  '结合slot expandRow': ['Combined with slot expandRow'],
  自定义过滤配置: ['Custom filter configuration'],
  '自定义保存 & 重置按钮': ['Customize the Save&Reset button'],
  过滤范围: ['Filter range'],
  排序范围: ['Sort range'],
  空数据: ['Empty data'],
  '过滤为空-试试过滤来源为 Email': ['Filter is empty - try filtering from Email'],
  '通过设置filterScope设置过滤范围为当前页面还是全部数据，如果是all，则过滤完毕会重置分页为首页': [
    'Set the filtering range to the current page or all data by setting the filterScope. If it is all, the paging will be reset to the first page after filtering',
  ],
  通过设置sortScope设置排序范围为当前页面还是全部数据: [
    'Set the sorting range to the current page or all data by setting the sortScope',
  ],
  'props: 支持 `field` 和 `prop`两种配置，配置效果一样': [
    'Props: supports\' field \'and\' prop \'configurations, with the same configuration effect',
  ],
  '配置scroll-loading属性设置表格底部加载样式，结合scroll-end监听表格滚动至底部事件进行分页加载': [
    'Configure the scroll-loading attribute to set the loading style at the bottom of the table, and combine with the scroll-end listening table to scroll to the bottom event for paging loading',
  ],
  表格设置: ['Table Settings'],
  表格行高: ['Table row height'],
  字段显示设置: ['Field display settings'],
  内置选择功能: ['Built-in selection function'],
  表格合并: ['Table merge'],
  序号: ['SN'],
  来源: ['Source'],
  '名称/内网IP': ['Name/intranet IP'],
  创建时间: ['Create time'],
  创建者: ['Creator'],
  更新时间: ['Update time'],
  操作: ['Operate'],
  清空表格数据: ['Clear table data'],
  依赖父级高度: ['Dependent on parent height'],
};

const DropdownMenu: LANG = {
  菜单出现的位置: ['Where the menu appears'],
  'slot[name=default] 配置触发对象，slot[name=content] 配置下拉菜单': [
    'Slot [name=default] Configure trigger object, slot [name=content] Configure drop-down menu',
  ],
  '通过配置参数 placement 可以让下拉菜单的位置，默认为 bottom': [
    'The position of the drop-down menu can be set to bottom by default through the configuration parameter placement',
  ],
  状态: [' status'],
  点击触发: ['Click to trigger'],
  hover触发: ['Hover trigger'],
  '通过 trigger=click 设置触发事件类型': ['Set the trigger event type through trigger=click'],
  自定义显示与隐藏: ['Customize display and hide'],
  '通过 isShow 下来菜单的显示与隐藏，trigger=manual下生效': [
    'Display and hide the menu through isShow and take effect under trigger=manual',
  ],
  '通过 disabled 来禁用下来弹出': ['Disable pop-up by disabling'],
  回调函数: ['Callback function'],
  '通过 show hide 设置显示与隐藏的回调': ['Set the displayed and hidden callbacks through show hide'],
  元素绑定在body下: ['The element is bound under body'],
  '通过 popoverOptions 设置 boundary: \'body\'': ['Set boundary: \'body\' through powerOptions'],
  更多操作: ['More Operations'],
  预发布环境: ['Pre-release environment'],
  测试环境: ['Testing environment'],
  正式环境: ['Formal environment'],
  开发环境: ['development environment'],
  调试环境: ['Debugging environment'],
  点击切换disabled: ['Click to switch disabled '],
  'Dropdown 属性': ['Dropdown Attributes'],
  'DropdownMenu 属性': ['DropdownMenu Attributes'],
  'DropdownItem 属性': ['DropdownItem Attributes'],
  'Dropdown 事件': ['Dropdown Event'],
  'DropdownItem 事件': ['DropdownItem Event'],
  '自定义控制显示与隐藏 trigger = manual 时生效': [
    'Custom control takes effect when trigger=manual is displayed and hidden',
  ],
  下拉菜单位置: ['Drop down menu position'],
  是否禁用弹出菜单: ['Whether to disable pop-up menu'],
  Popover组件的配置项: ['Configuration items of Popover component'],
  '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-dropdown 上': [
    'Configure the custom style class name, and the incoming class will be added to the DOM. bk-dropdown at the outermost layer of the component',
  ],
  '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-dropdown-menu 上': [
    'Configure the custom style class name, and the incoming class will be added to the DOM. bk-dropdown-menu at the outermost layer of the component',
  ],
  '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-dropdown-item 上': [
    'Configure the custom style class name, and the incoming class will be added to the DOM. bk-dropdown-item at the outermost layer of the component',
  ],
  显示时触发: ['Trigger on display'],
  隐藏时触发: ['Trigger when hidden'],
};

const ToolTips: LANG = {
  'Tooltips 工具提示 （指令）': ['Tooltips'],
  当鼠标指向页面元素时给出简单的提示: ['Give a simple prompt when the mouse points to the page element'],
  'v-model绑定默认激活的item项，idFiled作为唯一标识符,如果不填写默认为当前的item的index， list配置列表。': [
    'The v-model is bound to the item item that is activated by default, and idFiled is used as the unique identifier. If you do not fill in the index and list configuration list of the current item by default.',
  ],
  '基础用法（通过绑定对象来配置）': ['Basic usage (configured by binding objects)'],
  '通过指令配置简单的 tooltips': ['Configure simple tooltips through instructions'],
  不同位置: ['Different locations'],
  '通过 placement 属性展示不同位置的提示': ['Display prompts at different locations through the placement attribute'],
  '通过给 v-bk-tooltips 配置 trigger 为 click 来设置点击触发 tooltips': [
    'Set click trigger tooltips by configuring trigger to click for v-bk-tooltips',
  ],
  自定义回调函数: ['Custom callback function'],
  自定义显示以及隐藏时的回调函数: ['Customize the callback function when displaying and hiding'],
  提示信息内容: ['Prompt message content'],
  组件显示位置: ['Component display position'],
  是否在初始化时默认显示: ['Whether to display by default during initialization'],
  组件主题色: ['Component theme color'],
  是否显示箭头: ['Show arrow or not'],
  是否禁用提示框: ['Whether to disable the prompt box'],
  '显示的延迟，毫秒': ['Display delay, ms'],
  '配置自定义样式类名，传入的类会被加在组件最外层的 DOM': [
    'Configure the custom style class name, and the incoming class will be added to the outermost DOM of the component',
  ],
  显示提示框时触发函数: ['Trigger function when prompt box is displayed'],
  隐藏提示框时触发函数: ['Trigger function when the prompt box is hidden'],
};

const Tree: LANG = {
  'Tree组件， 为页面和功能提供列表': ['Tree component, providing lists for pages and functions'],
  启用虚拟滚动: ['Enable virtual scrolling'],
  启用连线: ['Enable connection'],
  自定义节点Icon: ['Custom Node Icon'],
  自定义节点内容: ['Custom node content'],
  '自定义节点Icon-jsx': ['Custom node Icon-jsx'],
  异步加载节点数据: ['Asynchronous loading of node data'],
  设置默认行为: ['Set default behavior'],
  设置默认选中: ['Set default selection'],
  设置默认展开所有节点: ['Set Default Expand All Nodes'],
  '默认连线 | 默认选中 | 默认展开': ['Default connection | default selection | default expansion'],
  '默认配置：["selected", "expand", "click"]': ['Default configuration: ["selected", "expand", "click"]'],
  搜索配置: ['Search for configuration'],
  配置搜索行为: ['Configure search behavior'],
  可拖拽: ['Draggable'],
  '通过 draggable 属性可让节点变为可拖拽。': ['The draggable attribute can make nodes draggable.'],
  可拖拽限制: ['Drag restrictions'],
  '通过 disableDrag(nodeData)、disableDrop(nodeData) 函数返回值 限制drag与drop,比如目录不能drop': [
    'Use the return values of the disableDrag (nodeData) and disableDrop (nodeData) functions to limit the drag and drop, for example, the directory cannot be dropped',
  ],
  '此处配置每个节点除了展开\\收起箭头之外的内容块时的行为': [
    'The behavior of each node\'s content block other than expanding collapsing the arrow is configured here',
  ],
  测试选中: ['Test selected'],
  详细配置: ['Detailed configuration'],
  简化配置: ['Simplify configuration'],
  默认连线: ['Default connection'],
  默认展开: ['Default Deployment'],
  默认过滤: ['Default filter'],
  默认排序: ['Default sort'],
  自定义连线: ['Custom connection'],
  自定义节点: ['Custom Node'],
  自定义节点类型: ['Custom Node Type'],
  自定义节点后缀: ['Custom node suffix'],
  自定义节点展开收起: ['Custom node expansion and collapse'],
  设置选中节点: ['Set selected node'],
  设置选中id: ['Set selected id'],
  '详细配置-自定义搜索条件': ['Detailed Configuration - Custom Search Criteria'],
  'function 函数返回 \'default\' 将会调用系统默认样式': [
    'If the function function returns\' default \', the system default style will be called',
  ],
  'function 返回字符串': ['Function returns a string'],
  'function 返回对象': ['Function returns an object'],
  'bk-tree 属性': ['Bk-tree Attributes'],
  'bk-table 方法': ['Bk-table method'],
  '--': ['--'],
  表格事件: ['Table event'],
  预留插槽: ['Reserved slot'],
  异步加载节点数据配置: ['Asynchronous loading of node data configuration'],
  渲染列表: ['Render List'],
  指定节点标签为节点对象的某个属性值: ['Specifies that the node label is an attribute value of the node object'],
  '每个树节点用来作为唯一标识的属性，此标识应该是唯一的;如果设置系统会默认自动生成唯一id': [
    'Each tree node is used as an attribute of unique identification, which should be unique; If set, the system will automatically generate a unique ID by default',
  ],
  '子节点 Key, 用于读取子节点': ['Child node Key, used to read child nodes'],
  '相邻级节点间的水平缩进，单位为像素': ['Horizontal indentation between adjacent level nodes, in pixels'],
  设置行高: ['Set row height'],
  '设置层级连线, 可通过true|false设置默认开启|关闭，也可以直接设置`1px dashed #c3cdd7`自定义样式，或者设置为回调函数，动态设置':
    [
      'To set the hierarchical connection, you can set the default on/off through true | false, or you can directly set the \'1px dashed # c3cdd7\' custom style, or set it as a callback function and set it dynamically',
    ],
  '是否开启虚拟滚动, 默认虚拟滚动是开启的，数据量大的情况下有利于性能优化，可以通过设置 virtualRender = false 关闭虚拟滚动':
    [
      'Whether to turn on virtual scrolling. By default, virtual scrolling is turned on, which is beneficial to performance optimization in case of large data volume. You can turn off virtual scrolling by setting virtualRender=false',
    ],
  '异步加载节点数据配置,详情请参考 IAsync配置': [
    'Asynchronous loading of node data configuration, please refer to IAsync configuration for details',
  ],
  每个节点偏移左侧距离: ['Offset left distance of each node'],
  '搜索配置,可以为一个配置项 SearchOption, 或者直接为一个字符串|数值|布尔值，如此则模糊匹配此值': [
    'Search configuration can be a configuration item SearchOption, or directly a string | numeric | boolean value, so the value will be fuzzy match',
  ],
  空数据显示文本: ['Empty data display text'],
  是否允许节点拖拽: ['Allow node dragging'],
  节点是否禁用作为拖拽开启元素: ['Whether the node is disabled as a drag open element'],
  节点是否禁用作为拖拽结束位置元素: ['Whether the node is disabled as the drag end position element'],
  '节点拖拽时可交换位置（开启拖拽可交换位置后将不支持改变层级）': [
    'The swappable position during node dragging (the level change is not supported after dragging the swappable position is enabled)',
  ],
  '当前节点标识图标, 通过 true | false，设置是否显示，如果需要自定义则配置为函数，返回VNode': [
    'The current node identification icon can be set to display or not by true | false. If it needs to be customized, it can be configured as a function, and VNode is returned',
  ],
  节点是否可以选中: ['Whether the node can be selected'],
  是否禁用非最后叶子节点的可选择配置: ['Whether to disable the optional configuration of non-last leaf node'],
  是否显示节点类型Icon: ['Whether to display node type Icon'],
  '默认选中的节点id(如果设置了node-key)或者节点对象，selectable为false时无效': [
    'The node id (if node-key is set) or node object selected by default is invalid when selectable is false',
  ],
  '仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的展开收起操作（需指定 row-是否自动检查当前节点是否有子节点, 节点前面的展开收起Icon会根据判定值做改变.如果需要自已控制，请设置为false':
    [
      'Only valid for columns with type=selection. If the type is Boolean, and it is true, the previously selected expansion and collapse operation will be retained after the data is updated (you need to specify row - whether to automatically check whether the current node has child nodes, and the expansion and collapse icon in front of the node will change according to the judgment value. If you need to control yourself, please set it to false',
    ],
  '如果设置了某一个叶子节点状态为展开，是否自动展开所有父级节点,默认为true，如果设置为false，则每层状态需要自己控制': [
    'If a leaf node is set to expand, whether to automatically expand all parent nodes is true by default. If it is set to false, the status of each layer needs to be controlled by itself',
  ],
  默认是否展开所有节点: ['Expand all nodes by default'],
  '节点内容点击行为，此处配置每个节点除了展开\\收起箭头之外的内容块时的行为.默认为 [\'selected\', \'expand\', \'click\']，点击内容块为选中当前节点, 如果要禁用所有行为，请设置为空数组 []':
    [
      'Click behavior of node content. This is used to configure the behavior of each node\'s content block except for expanding collapsing the arrow. The default is [\'selected\', \'expand\', \'click\']. Click the content block to select the current node. If you want to disable all behaviors, please set it to an empty number group []',
    ],
  '点击节点需要执行的异步函数, 返回 Promise': [
    'Click the asynchronous function that the node needs to execute and return to Promise',
  ],
  '是否缓存异步请求结果, true 只在第一次点击请求异步函数, false 每次点击都执行异步函数': [
    'Whether to cache asynchronous request results. True only requests asynchronous functions on the first click, false executes asynchronous functions on each click',
  ],
  '异步请求节点是否自动展开, 可选值：once 只在初始化时执行一次；every 每次数据更新都执行': [
    'Whether the asynchronous request node is automatically expanded. Optional values: once is only executed once during initialization; Every data update is executed',
  ],
  需要匹配的值: ['Value to match'],
  '匹配方式, 支持模糊匹配（fuzzy） || 完全匹配（full）, 支持自定义匹配函数 (searchValue, itemText, item) => true || false':
    [
      'Matching method, support fuzzy matching {\'||\'} full matching, support user-defined matching function (searchValue, itemText, item)=>true  {\'||\'} false',
    ],
  搜索结果如何展示: ['How to display search results'],
  默认展开所有搜索结果: ['Expand all search results by default'],
  节点点击: ['Node click'],
  节点点击事件: ['Node click event'],
  节点收起事件: ['Node collapse event'],
  节点展开事件: ['Node expansion event'],
  节点勾选事件: ['Node tick event'],
  节点拖拽开始事件: ['Node drag start event'],
  节点拖拽经过事件: ['Node dragging event'],
  节点拖拽离开事件: ['Node dragging and leaving event'],
  节点拖拽释放事件: ['Node drag release event'],
  判定指定节点是否选中: ['Determine whether the specified node is selected'],
  判定指定节点是否为根节点: ['Determine whether the specified node is a root node'],
  判定指定节点是否展开: ['Determine whether the specified node is expanded'],
  判定指定节点是否匹配成功: ['Determine whether the specified node matches successfully'],
  判定指定节点是否有子节点: ['Determine whether the specified node has child nodes'],
  指定节点展开: ['Specify node expansion'],
  设置指定节点是否选中: ['Set whether the specified node is selected'],
  设置指定节点是否展开: ['Set whether the specified node is expanded'],
  异步请求触发点击节点: ['Asynchronous request trigger click node'],
  '获取当前树配置数据（经过内部处理的数据）': ['Get the current tree configuration data (data processed internally)'],
  '设置指定节点行为 checked isOpen': ['Set the specified node behavior checked isOpen'],
  节点类型Icon: ['Node type Icon'],
  自定义节点后面的扩展展示: ['Extension display behind the custom node'],
  '展开|收起自义定渲染': ['Expand | Collapse self defined rendering'],
  'bk-table 属性': ['Bk-table Attributes'],
  'LINE_HEIGHT = 42; SCROLLY_WIDTH = 4;': ['LINE_HEIGHT = 42; SCROLLY_WIDTH = 4;'],
  显示的数据: ['Displayed data'],
  '表格列的配置描述，具体项参考IColumn': [
    'For the configuration description of table columns, refer to IColumn for specific items',
  ],
  '当前选中列,当设置选中多列时（columnPick = multi），配置为数组[index1, index2, index3]，只能选中单列时，可以为数值或者数组[index]':
    [
      'The currently selected column can be configured as an array [index1, index2, index3] when multiple columns are selected (columnPick=multi). When only one column can be selected, it can be numeric or array [index]',
    ],
  '表格列选中方式,支持：': ['The table column selection method supports:'],
  '设置表格高度,auto 根据行数自动填充高度, 100%，依赖初始化时父级容器高度': [
    'Set the height of the table. Auto fills the height automatically according to the number of rows, 100%, depending on the height of the parent container during initialization',
  ],
  设置表格最小高度: ['Set the minimum height of the table'],
  设置表格最大高度: ['Set the maximum height of the table'],
  '行高，可以为固定数值类型, 可以是函数，返回当前行的高度，返回值为数值类型': [
    'Row height, which can be a fixed numeric type or a function, returns the height of the current row, and the return value is a numeric type',
  ],
  'Thead行高，可以为固定数值类型': ['Thead row height, which can be a fixed numeric type'],
  是否显示Head: ['Show Head'],
  '表头配置，详细参考IHead，如果同时配置了thead和head-height、show-head，thead优先级最高，会覆盖其他配置': [
    'For the header configuration, refer to IHead for details. If the theme, head-height, and show-head are configured at the same time, the theme has the highest priority and will overwrite other configurations',
  ],
  '是否启用虚拟渲染 & 滚动, 当数据量很大时，启用虚拟渲染可以解决压面卡顿问题': [
    'Whether to enable virtual rendering&rolling. When the amount of data is large, enabling virtual rendering can solve the problem of pressing surface jamming',
  ],
  '表格边框显示设置，可以是一个组合; 生效规则: 除非单独设置 none,否则会追加每个设置': [
    'Table border display settings can be a combination; Effective rule: unless none is set separately, each setting will be appended',
  ],
  '分页配置, 默认值为false，不启用分页; 设置为 true，启用分页功能，默认值参考分页组件': [
    'Paging configuration. The default value is false. Paging is not enabled; Set to true to enable the paging function. The default value refers to the paging component',
  ],
  '分页配置, 默认值为false，不启用分页; 设置为 true，启用分页功能，默认值参考分页组件 Pagination': [
    'Paging configuration. The default value is false. Paging is not enabled; Set to true to enable paging. The default value refers to paging component Pagination',
  ],
  是否启用远程分页: ['Enable remote paging'],
  空数据展示: ['Empty data display'],
  'bk-table-setting-content,用于设置表格行高、显示列...，详细参考ISettings': [
    'Bk-table-setting-content, used to set the table row height, display columns, Refer to ISettings for details',
  ],
  '行的 class 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style': [
    'The callback method of the row\'s class can also use a fixed object to set the same style for all rows',
  ],
  '行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style': [
    'The callback method of the style of the line can also use a fixed object to set the same style for all lines',
  ],
  '单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style': [
    'The callback method of cell style can also use a fixed object to set the same style for all cells',
  ],
  '单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className': [
    'Callback method of cell\'s className, or set a fixed className for all cells using a string',
  ],
  '表格底部loading加载效果，可以配合表格scroll-bottom事件使用, 详细配置可参考bk-loading组件': [
    'The loading effect at the bottom of the table can be used in conjunction with the table scroll-bottom event. For detailed configuration, refer to the bk-loading component',
  ],
  '仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的展开收起操作（需指定 row-key）':
    [
      'Only valid for columns with type=selection. If the type is Boolean, and if it is true, the previously selected expand and collapse operations will be retained after the data is updated (row-key needs to be specified)',
    ],
  '行数据的 Key，用来优化 Table 的渲染。此key用于渲染table row的key，便于大数据渲染时的性能优化。在使用 reserve-selection, reserve-expand 功能的情况下，该属性是必填的。类型为 String 时，支持多层访问：user.info.id，同时支持 user.info[0].id':
    [
      'The key of the row data is used to optimize the rendering of the table. This key is used to render the key of table row, which is convenient for performance optimization during big data rendering. This attribute is required when the reserve-selection and reserve-expand functions are used. When the type is String, multi-level access is supported: user.info.id, and user.info [0]. id is also supported',
    ],
  '表格cell内容超长时，是否自动展示tooltip，默认值为false，可以通过设置为true开启，如果需要自定义content请设置为对象，具体参考 IOverflowTooltip（此处配置整个table都启用，单个column配置可覆盖）':
    [
      'If the table cell content is too long, whether to automatically display tooltip. The default value is false. It can be enabled by setting it to true. If you need to customize the content, please set it as an object. For details, please refer to IOverflowTooltip (the entire table is enabled here, and the single column configuration can be overwritten)',
    ],
  '仅对设置了selection的情况下生效, 用于初始化或者更新row已选中状态,内部使用逻辑为：row[selectionKey]，可以为多级选择，但是多级选择只支持 row.child.child，更多请参考lodash.get':
    [
      'It only takes effect when selection is set. It is used to initialize or update the selected status of row. The internal use logic is: row [selectionKey]. It can be multi-level selection, but multi-level selection only supports row.child.child. For more information, please refer to lodash.get',
    ],
  '提供自定义判定当前行是否选中, 如果设置了此属性，其他判定均不生效, ({ row, cell, data }) => bool': [
    'Provide user-defined judgment to determine whether the current row is selected. If this attribute is set, other judgments will not take effect, ({\'{\'}row, cell, data{\'}\'})=>bool',
  ],
  '为避免不必要的数据修改导致的不可控组件更新,默认组件不会对传入组件的data进行任何修改,设置此属性为true则会对源数据进行同步（如：启用selection，勾选时想要自动同步到源数据）, 目前只会对指定了selectionKey的情况下才会对指定的字段数据进行更新，同时需要指定 rowKey，保证匹配到的row是正确的目标对象':
    [
      'To avoid uncontrollable component updates caused by unnecessary data modification, the default component will not make any changes to the data of the incoming component. If this property is set to true, the source data will be synchronized (for example, if you enable selection, you want to automatically synchronize to the source data when you check it). Currently, the specified field data will be updated only when the selectionKey is specified. At the same time, you need to specify the rowKey, Ensure that the matched row is the correct target object',
    ],
  '鼠标划过行样式行为,配置`highlight`会高亮当前行，`auto`自行设置样式': [
    'Mouse over line style behavior, configure \'highlight\' to highlight the current line, and \'auto\' to set the style by itself',
  ],
  '如果只指定了 prop, 没有指定 order, 则默认顺序是 asc, 配置格式：{ column: order }': [
    'If only prop is specified and no order is specified, the default order is asc, and the configuration format is {\'{\'}column: order{\'}\'}',
  ],
  '* 配合 column selection 使用用于配置渲染行数据的勾选框是否可用, 可以直接为 true|false，全部启用或者禁用如果是函数，则返回 true|false({ row, index, isCheckAll }) => boolean':
    [
      '*Use with column selection to configure whether the check box for rendering row data is available. It can be directly true | false. If it is a function, it will return true | false ({\'{\'}row, index, isCheckAll{\'}\'})=>boolean',
    ],
  '当外层容器尺寸改变时，当前组件用什么方式进行重新计算,默认为 throttle，按照指定频率重新计算,可选值：debounce，在指定时间范围内只执行一次重新计算':
    [
      'When the size of the outer container changes, the current component is recalculated in what way. The default value is throttle. The recalculation is performed according to the specified frequency. The optional value is debounce. Only one recalculation is performed within the specified time range',
    ],
  列配置详细说明: ['Detailed description of column configuration'],
  '显示的标题，可以是字符串或者函数，函数的话需要返回一个String类型字符串': [
    'The displayed title can be a string or a function. The function needs to return a String type string',
  ],
  '绑定的展示字段，可以是字符串或者函数，函数的话需要返回一个存在的字段名称': [
    'The bound display field can be a string or a function. The function needs to return an existing field name',
  ],
  '禁用（disabled）': ['Disabled'],
  '单列（single）': ['Single'],
  '多列（multi）': ['Multi-column'],
  'auto，依赖外层高度': ['Auto, depending on the outer height'],
  '此属性只在<bk-column>模板绑定时才会生效，如果是函数式绑定请使用`field`. 绑定的展示字段，可以是字符串或者函数，函数的话需要返回一个存在的字段名称':
    [
      'This attribute only takes effect when the<bk-column>template is bound. If it is a functional binding, please use \'field\' The bound display field can be a string or a function. The function needs to return an existing field name',
    ],

};

const Tags: LANG = {
  '用于标记事物的属性 & 维度和分类的小标签': [
    'Small labels for marking attributes of things&dimensions and classifications',
  ],
  标签是否可以关闭: ['Whether the label can be closed'],
  是否点击选中: ['Click to select'],
  '设置标签的选中状态，跟 checkable 配合使用': ['Set the selected status of the label and use it with checkable'],
  '通过 theme 设置不同的主题， success / info / warning / danger. 也可通过 ext-cls 配置自定义样式类名': [
    'Set different themes through theme, success/info/warning/danger You can also configure the custom style class name through ext-cls',
  ],
  标签圆角设置: ['Label fillet settings'],
  配置自定义样式类名: ['Configure custom style class name'],
  自定义圆角: ['Custom fillets'],
  可关闭标签: ['Closeable label'],
  可选择标签: ['Selectable label'],
  不同样式: ['Different styles'],
  点击关闭标签: ['Click Close tab'],
  '点击后即可选中, 再次点击取消': ['Click to select, and click again to cancel'],
  '配置 checkable 实现点击切换选中效果，checked 可设置标签的选中状态': [
    'Configure checkable to switch the selection effect by clicking, and checked to set the selected status of the label',
  ],
  '基础样式，填充式，描边式': ['Basic style, fill type, stroke type'],
  '通过 radius 配置项可自定义圆角大小': ['Fillet size can be customized through radius configuration item'],
  '通过设置 closable 定义 Tag 是否可移除': ['Define whether the tag can be removed by setting closable'],
  '通过 type 设置不同的样式，默认是基础样式，还提供填充式（filled），描边式（stroke）': [
    'Set different styles through type. The default is the basic style. It also provides filled and stroke styles',
  ],
  '带图标 Icon 标签': ['Icon label with icon'],
  '可以添加 icon 的 Tag': ['Tag that can add icon'],
  '通过 icon 插槽给 Tag 添加 icon': ['Add icon to tag through icon slot'],
  企业邮箱: ['Enterprise mailbox'],
};

const Diff: LANG = {
  '代码差异对比使用highlight.js做代码高亮，所以在使用该组件之前，请先安装highlight.js依赖': [
    'Code difference comparison uses highlight.js for code highlighting, so before using this component, please install highlight.js dependency',
  ],
  '配置对比内容 old-content 和 new-content': [
    'Presentation method configuration configuration comparison content old-content and new-content',
  ],
  'CodeDiff 属性': ['CodeDiff Attributes'],
  展示方式配置: ['Display mode configuration'],
  配置展示方式format: ['Configure presentation format'],
  暗黑主题配置: ['Diablo theme configuration'],
  配置Theme: ['Configure Theme'],
  不隐藏行数配置: ['Do not hide row count configuration'],
  配置diffContext: ['Configure diffContext'],
  旧内容: ['Old content'],
  新内容: ['New content'],
  不同地方间隔多少行不隐藏: ['How many lines are not hidden in different places'],
  主题风格: ['Theme style'],
  语法高亮: ['Syntax highlighting'],
  'highlight 对象': ['Highlight object'],
  'Sorry，您的权限不足!': ['Sorry, your permission is insufficient!'],
  '无法连接到后端服务，请稍候再试。': ['Unable to connect to the back-end service. Please try again later.'],
};

const VirtualRender: LANG = {
  'virtual-render 为页面和功能提供列表': ['Virtual-render provides a list of pages and functions'],
  '基础用法，用于表单内容的录入': ['Basic usage, used for entering form content'],
  自定义行高: ['Custom row height'],
  '随机1000-9999行数据': ['Random 1000-9999 rows of data'],
  当前行数: ['Current number of rows'],
  '每行高度不一致，自定义每行高度': ['The height of each row is inconsistent. Customize the height of each row'],
  小型分页: ['Small paging'],
  是否显示总计: ['Show totals'],
  上一页按钮文案: ['Previous button copy'],
  下一页按钮文案: ['Next button copy'],
};

const Pagination: LANG = {
  数据分页: ['Data pagination'],
  数据总数: ['Total data'],
  当前页码: ['Current page number'],
  '每页显示条数(须存在于limit-list中)': ['Number of displayed items per page (must exist in the limit-list)'],
  每页显示条数可选项列表: ['Display a list of items per page'],
  是否显示每页显示条数控件: ['Whether to display the number of items per page control'],
  组件外观类型: ['Component appearance type'],
  '分页控件位置，优先级高于location': ['Paging control position, priority higher than location'],
  每页显示条数控件位置: ['Display number of items per page control position'],
  当前页码变化时的回调: ['Callback when the current page number changes'],
  当前分页尺寸变化时的回调: ['Callback when the current page size changes'],
  'Pagination 属性': ['Pagination Attributes'],
  'Pagination 事件': ['Pagination Event'],
  条: ['Strip'],
  每页: ['Each page'],
  共计: ['Total'],
};

export default {
  ...Badge,
  ...Progress,
  ...Collapse,
  ...AnimateNumber,
  ...Rate,
  ...Swiper,
  ...Table,
  ...DropdownMenu,
  ...ToolTips,
  ...Tree,
  ...Tags,
  ...Diff,
  ...VirtualRender,
  ...Pagination,
};
