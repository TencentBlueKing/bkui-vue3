/*
import { Popover } from '@bkui-vue/popover';
import Message from './../../packages/message/src/index';
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

const Loading: LANG = {
  '覆盖正在加载数据的组件一个 loading 层': ['Overwrite a loading layer for the component that is loading data'],
  'primary danger warning(spin模式下支持: primary danger warning success, white)': [
    'primary danger warning (supported in rotating mode: main hazard warning successful, white)',
  ],
  'loading 遮罩的背景透明度 （注：如设置了 color 属性为 rgba 类型颜色则此属性将被覆盖）': [
    'The background transparency of the loading mask (note: if the color attribute is set to rgba type color, this attribute will be overwritten)',
  ],
  'loading 遮罩的背景色 支持 rgb/hex/rgba': ['The background color of the loading mask supports rgb/hex/rgba'],
  '对指定 dom 节点添加 loading 效果': ['Add the loading effect to the specified dom node'],
  配置大小: ['Configure size'],
  配置主题: ['Configure Theme'],
  配置文案: ['Configuration copy'],
  '配置 mode loading的显示形式': ['Configure the display form of mode loading'],
  '配置 mode 为 spin 可使其以spin的形式显示': ['Configure the mode to spin to display it in the form of spin'],
  '配置 loading 遮罩的背景透明度与背景色': [
    'Configure the background transparency and background color of the loading mask',
  ],
  'loading 遮罩的背景透明度会由传入的 opacity 参数决定，此参数为 0 至 1 之间的数字，默认为 0.9 背景色则由color属性决定。':
    [
      'The background transparency of the loading mask is determined by the passed in opacity parameter, which is a number between 0 and 1. The default value is 0.9. The background color is determined by the color attribute.',
    ],
  '传入 size，可以配置 loading 效果大小': ['Pass in the size to configure the loading effect size'],
  '传入 theme，可以配置 loading 效果主题': ['Pass in theme to configure the loading effect theme'],
  '传入 title，值会被渲染到 loading 图标的下方': [
    'Pass in title, and the value will be rendered below the loading icon',
  ],
  'Loading 属性': ['Loading Attributes'],
  '0-1之间的小数': ['Decimals between 0-1'],
};

const Alert: LANG = {
  展示页面的提示信息: ['Prompt information of display page'],
  是否可以关闭: ['Whether it can be closed'],
  成功的提示文字: ['Prompt text for success'],
  消息的提示文字: ['Prompt text of message'],
  警告的提示文字: ['Warning prompt text'],
  错误的提示文字: ['Wrong prompt text'],
  不显示ICON: ['Do not display ICON'],
  可关闭: ['Can be closed'],
  自定义关闭按钮文字: ['Custom close button text'],
  继续努力: ['Keep trying'],
  删掉: ['Delete'],
  自定义关闭按钮文案: ['Custom Close Button Text'],
  是否显示ICON: ['Display ICON'],
  关闭事件: ['Close event'],
  'Alert 属性': ['Alert Attributes'],
  'Alert 事件': ['Alert Events'],
  'Alert 插槽': ['Alert Slots'],
  '下次见！': ['See you next time!'],
};

const Exception: LANG = {
  服务维护中: ['Service maintenance'],
  搜索为空: ['Search is empty'],
  页面不存在: ['Page does not exist'],
  切换: ['Switch'],
  灰色: ['grey'],
  白色: ['white'],
  背景: ['background'],
  功能建设中: ['Function construction in progress'],
  无业务权限: ['No business permission'],
  拉取用户配置数据失败: ['Failed to pull user configuration data'],
  请登入蓝鲸: ['Please log in to blue king'],
  自定义icon: ['Custom icon'],
  去申请: ['Apply'],
  重新获取: ['Reacquire'],
  刷新页面: ['Refresh Page'],
  异常类型: ['Exception type'],
  局部异常提示: ['Local exception prompt'],
  'page（页面）': ['Page'],
  'part（局部）': ['Part'],
  '异常 title': ['Exception title'],
  '异常 description': ['Exception description'],
  '配置 scene 为使用场景为 part': ['Configure scene as part'],
  '配置 type 为异常类型 403、404、500、building、empty、search-empty，也可以不配置，默认为 404': [
    'The configuration type is the exception type 403, 404, 500, building, empty, search-empty, or not. The default is 404',
  ],
  '你没有相应业务的访问权限，请前往申请相关业务权限': [
    'You do not have access rights to the corresponding business, please go to apply for relevant business rights',
  ],
};

const Card: LANG = {
  卡片标题: ['Card Title'],
  Card卡片标题: ['Card title'],
  编辑标题: ['Edit Title'],
  'Card 卡片是一种容器，可以将信息聚合展示。': ['Card card is a container that can aggregate and display information.'],
  '通过配置footer插槽，自定义 Card 中底部内容 的展示。同理使用header插槽， 可自定义 Card 中顶部内容展示': [
    'Customize the display of the bottom content of the card by configuring the footer slot. Similarly, the header slot can be used to customize the display of the top content in the card',
  ],
  '通过配置isEdit属性为true即可开启标题功能，enter或失焦保存': [
    'The title function can be enabled by configuring the isEdit attribute to true, and enter or lose focus to save',
  ],
  '是否支持展开&收起': ['Whether expansion&collapse is supported'],
  '展开 & 收起状态': ['Expand&Collapse Status'],
  展开icon的显示位置: ['Expand the display position of icon'],
  是否显示头部: ['Whether to display the head'],
  是否显示底部: ['Show bottom'],
  是否显示边框: ['Show border or not'],
  是否启用编辑标题功能: ['Whether to enable editing title function'],
  '是否禁用Header的line-height默认样式': ['Whether to disable the line-height default style of header'],
  '卡片内容 1': ['Card content 1'],
  '卡片内容 2': ['Card content 2'],
  '卡片内容 3': ['Card content 3'],
};

const Popover: LANG = {
  '当鼠标经过这段文字时，会显示一个气泡框': ['When the mouse passes this text, a bubble box will be displayed'],
  最简单的用法: ['The simplest use'],
  超长内容: ['Super long content'],
  '通过自定义 slot 显示多行文本或更复杂的样式': [
    'Display multiple lines of text or more complex styles through custom slots',
  ],
  总是显示: ['Always show'],
  '设置属性 always 总是显示提示框': ['Set the property always to display the prompt box'],
  显示的内容: ['Displayed content'],
  '触发方式。如果值为manual，则通过isShow控制显示、隐藏': [
    'Trigger method. If the value is manual, display and hide are controlled by isShow',
  ],
  '控制显示、隐藏': ['Control display and hide'],
  提示框的内容容器的宽度: ['The width of the content container of the prompt box'],
  提示框的内容容器的高度: ['The height of the content container of the prompt box'],
  是否总是可见: ['Is it always visible'],
  弹出内容绑定元素: ['Popup content binding element'],
  '如果设置了boundary为指定DOM，此配置项生效。是否将弹出内容固定到目标元素位置。例如：boundary = document.body, fixOnBoundary = true，则弹出内容会一直固定到body':
    [
      'If boundary is set to specify DOM, this configuration item will take effect. Whether to fix the pop-up content to the target element position. For example: boundary=document. body, fixOnBoundary=true, the pop-up content will be fixed to body',
    ],
  '这里是提示文字当鼠标经过这段文字时，会显示一个气泡框当鼠标经过这段文字时，会显示一个气泡框当鼠标经过这段文字时': [
    'Here is the prompt text. When the mouse passes this text, a bubble box will be displayed. When the mouse passes this text, a bubble box will be displayed. When the mouse passes this text',
  ],
  文字提示: ['Text tips'],
  超长: ['Overlength'],
  '今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错': [
    'Today\'s weather is good today\'s weather is good today\'s weather is good today\'s weather is good today\'s weather is good today',
  ],
  '通过 placement 属性展示十二种方位的提示': ['Display twelve directions through the placement attribute'],
  上边: ['Top'],
  上左: ['Top Left'],
  上右: ['Top Right'],
  左上: ['Top Left'],
  右上: ['Right Top'],
  左边: ['Left'],
  右边: ['Right'],
  下边: ['Botoom'],
  左下: ['Left Bottom'],
  右下: ['Right Bottom'],
  下左: ['Bottom Left'],
  下右: ['Bottom Right'],
  'Top Left 文字提示': ['Top Left text prompt'],
  'Top Center 文字提示': ['Top Center text prompt'],
  'Top Right 文字提示': ['Top Right text prompt'],
  'trigger click': ['trigger click'],
  'mouse click': ['mouse click'],
  当鼠标点击: ['When the mouse click'],
  '手动设置IsShow = true': ['Manually set IsShow=true'],
  '手动设置IsShow = false': ['Manually set IsShow=false'],
  点击初始化Popover: ['Click to initialize Popover'],
};

const Message: LANG = {
  '用户操作后的消息提示，用于成功、失败、警告等消息提醒。': [
    'The message prompt after the user\'s operation is used to remind the success, failure, warning and other messages.',
  ],
  '关闭组件时的回调函数, 参数为组件实例': [
    'Callback function when closing the component, parameter is component instance',
  ],
  使用默认配置的消息提示: ['Use default configured message prompts'],
  '消息提醒提供消息、成功、警告、失败四种主题': [
    'Message reminder provides four themes: message, success, warning and failure',
  ],
  内置主题: ['Built-in theme'],
  消息关闭: ['Message Close'],
  '配置 delay 字段定义消息自动关闭的时间，当值为 0 时不自动关闭。配置 dismissable 字段控制是否显示右侧的手动关闭 icon。':
    [
      'Configure the delay field to define the time when the message is automatically closed. When the value is 0, the message is not automatically closed. Configure the disassible field to control whether the manual closing icon on the right is displayed.',
    ],
  组件显示的文字内容: ['Text content displayed by the component'],
  '组件延时关闭时间，值为 0 时需要手动关闭': [
    'The delay closing time of the component needs to be manually closed when the value is 0',
  ],
  '是否显示右侧关闭 icon': ['Whether to display the right closing icon'],
  组件出现时距离视口顶部的偏移量: ['Offset from the top of the viewport when the component appears'],
  多个组件之间的垂直距离: ['Vertical distance between multiple components'],
  '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-message 上': [
    'Configure the custom style class name, and the incoming class will be added to the DOM. bk-message at the outermost layer of the component',
  ],
  默认配置的消息提示: ['Message prompt for default configuration'],
  '选择你导入的构建机并填写相关信息，系统将为你安装必要的软件': [
    'Select the build machine you imported and fill in the relevant information. The system will install the necessary software for you',
  ],
  消息: ['News'],
  '恭喜！你提交的申请已经审核通过，请及时跟进了解下一步操作方式': [
    'congratulations! The application you submitted has been approved. Please follow up and understand the next operation method in time',
  ],
  '系统即将于19：00-21：00进行升个级，请及时保存你的资料': [
    'The system will be upgraded from 19:00-21:00. Please save your data in time',
  ],
  '系统错误，请稍后重试': ['System error, please try again later'],
  '10s 后关闭': ['Close after 10s'],
  不自动关闭: ['Do not close automatically'],
  '不显示关闭 icon': ['Do not display the closing icon'],
};

const InfoBox: LANG = {
  'infoBox 消息提示': ['InfoBox message prompt'],
  初始化时否展示: ['Display during initialization'],
  关闭执行函数: ['Close execution function'],
  确定执行函数: ['Determine execution function'],
  确认按钮文字: ['Confirm button text'],
  取消按钮文字: ['Cancel button text'],
  弹框的标题: ['Title of the frame'],
  弹窗内容: ['Popup Content'],
  各种状态: ['Various states'],
  实例复用: ['Instance reuse'],
  默认配置的提示框1: ['Prompt box 1 for default configuration'],
  默认配置的提示框2: ['Prompt box 2 for default configuration'],
  '显示 header 的位置': ['Display the position of the header'],
  '显示 footer 的位置': ['Show the location of the footer'],
  颜色按钮类型: ['Color button type'],
  自定义对话框宽度: ['Customize dialog box width'],
  自定义对话框高度: ['Customize dialog height'],
  对话框尺寸: ['Dialog size'],
  '弹框出现时，是否允许页面滚动': ['Allow page scrolling when the pop-up box appears'],
  '是否显示右上角的关闭 icon': ['Whether to display the closing icon in the upper right corner'],
  '是否允许 esc 按键关闭弹框': ['Allow esc button to close the pop-up'],
  是否允许出现遮罩: ['Whether mask is allowed'],
  是否允许点击遮罩关闭弹框: ['Whether it is allowed to click the mask to close the pop-up box'],
  是否全屏: ['Full screen or not'],
  是否可拖拽: ['Whether it can be dragged '],
  'confirm 确定按钮': ['Confirm button'],
  展示: ['Show'],
  隐藏: ['Hide'],
  按钮1: ['Button 1'],
  按钮2: ['Button 2'],
  请确认是否重置: ['Please confirm whether to reset'],
  '重置SecureKey，需要自行修改templates中的callback地址字段！': [
    'To reset SecureKey, you need to modify the callback address field in templates!',
  ],
  '重置SecureKey，需要自行修改templates中的callback地址字段': [
    'To reset SecureKey, you need to modify the callback address field in templates',
  ],
  '确认要删除？': ['Are you sure you want to delete?'],
  InfoBox函数返回实例: ['InfoBox function returns an instance'],
  此操作存在安全风险: ['There is a security risk in this operation'],
  添加用户成功: ['Add user succeeded'],
  添加用户失败: ['Failed to add user'],
  继续添加: ['Continue adding'],
  请稍等: ['One moment please'],
  直接使用: ['Direct use'],
  更新infoBox: ['Update infoBox'],
  '点击删除(成功)': ['Click Delete (successful)'],
  '点击删除(失败)': ['Click Delete (failed)'],
  'InfoBox函数参数（以Dialog为准）': ['InfoBox function parameters (subject to Dialog)'],
  '调用 InfoBox 方法，配置 title, subTitle 等参数': [
    'Call the InfoBox method, configure the title, subTitle and other parameters',
  ],
  '配置 type 的值，实现成功，错误，警告，加载中的不同类型': [
    'Configure the value of type, implementation success, error, warning, different types in loading',
  ],
  '对话框分为4种类型。通过 dialogType 属性 设置为 confirm 实现': [
    'There are four types of dialog boxes. Implemented by setting the dialogType property to confirm',
  ],
};

const Notify: LANG = {
  使用默认配置的通知提示: ['Use the default configured notification prompt'],
  '通知提示提供消息、成功、警告、失败四种主题': [
    'The notification prompt provides four topics: message, success, warning and failure',
  ],
  '通知出现可以从 4 个方向出现：左上角、右上角、左下角、右下角': [
    'The notification can appear in four directions: upper left corner, upper right corner, lower left corner and lower right corner',
  ],
  '配置 delay 字段定义通知自动关闭的时间，当值为 0 时不自动关闭。配置 dismissable 字段控制是否显示右侧的手动关闭 icon。':
    [
      'Configure the delay field to define the time when the notification is automatically closed. When the value is 0, the notification is not automatically closed. Configure the disassible field to control whether the manual closing icon on the right is displayed.',
    ],
  组件的标题: ['Title of the component'],
  组件出现的方向: ['Direction in which components appear'],
  组件出现时距离视口的水平偏移量: ['The horizontal offset from the viewport when the component appears'],
  '用来给用户推送通知提示信息，通知可配置为从界面的四个角出现': [
    'It is used to push notification prompt information to users. The notification can be configured to appear from the four corners of the interface',
  ],
  默认没有标题: ['No title by default'],
  通知关闭: ['Notify Close'],
  通知出现的位置: ['Where the notification appears'],
  默认配置的通知提示: ['Default configured notification prompt'],
  '你好！欢迎你使用蓝鲸智云产品': ['Hello! Welcome to use Blue Whale Smart Cloud products'],
  '你好，你申请的功能权限现已开通，请及时登录查询。如有疑问，请与蓝鲸智云管理人员联系或关注微信公众账号。': [
    'Hello, the function permission you applied for has been opened. Please log in and check in time. If you have any questions, please contact the Blue Whale Smart Cloud administrator or follow the WeChat public account.',
  ],
  左上角: ['top left corner'],
  右上角: ['top right corner'],
  左下角: ['bottom left corner'],
  右下角: ['bottom right corner'],
};

const Slider: LANG = {
  '用于操作反馈的中间态(loading)、成功、失败等': [
    'Intermediate state (loading), success, failure, etc. for operation feedback',
  ],
  'Slider 属性': ['Slider Attributes'],
  'Slider 事件': ['Slider Events'],
  刻度: ['Scale'],
  带输入: ['With input'],
  垂直: ['Vertical'],
  自定义: ['Custom'],
  糟糕: ['Terrible'],
  一般: ['Commonly'],
  还行: ['Okay'],
  还行勉勉强强: ['I\'m still struggling'],
  满意: ['Satisfied'],
  很好: ['Good'],
  非常满意: ['Very satisfied'],
  '使用 v-model 将变量与 slider 滑杆进行数据绑定，默认最大值 max-value 为 100, 默认最小值为 min-value 0': [
    'Use v-model to bind variables with slider slider. The default maximum max-value is 100, and the default minimum value is min-value 0',
  ],
  '	使用v-model，将指定变量与slider的值进行绑定': [
    'Use v-model to bind the specified variable with the value of slider',
  ],
  自定义类名: ['Custom class name'],
  是否垂直: ['Vertical or not'],
  是否禁用: ['Disabled or not'],
  每一步的距离: ['Distance per step'],
  是否为分段式: ['Whether it is segmented'],
  是否显示间断点: ['Show breakpoints or not'],
  是否显示间断点下的文字: ['Whether to display the text below the breakpoint'],
  是否显示滑块的tip: ['Whether to display the tip of the slider'],
  是否显示首尾的文字: ['Whether to display the first and last text'],
  垂直状态下的高度: ['Height in vertical state'],
  '是否显示滑块下的问题，不可与showIntervalLabel同时使用': [
    'Whether to display the problem under the slider. It cannot be used together with showIntervalLabel',
  ],
  自定义内容: ['Custom content'],
  自定义间断点下的文字格式: ['Customize the text format under breakpoints'],
  自定义滑块下下的文字格式: ['Customize the text format under the slider'],
  自定义滑块tip格式: ['Custom slider tip format'],
  鼠标弹起时触发: ['Triggered when the mouse pops up'],
  是否显示输入框: ['Whether to display the input box'],
  '使用v-model，将指定变量与slider的值进行绑定': [
    'Use v-model to bind the specified variable with the value of slider',
  ],
};

const SideSlider: LANG = {
  'Sideslider 属性': ['Sideslider Attributes'],
  'Sideslider 事件': ['Sideslider Events'],
  'Sideslider 插槽': ['Sideslider Slots'],
  'Sideslider组件， 提供一个从两侧滑入的组件，供用户填写/查看更多信息。': [
    'Sideslider component provides a component that slides in from both sides for users to fill in/view more information.',
  ],
  我是标题: ['I am the title'],
  我是自定义标题: ['I am custom title'],
  我是自定义内容: ['I am custom content'],
  设置内容高度1000px: ['Set content height 1000px'],
  设置内容高度400px: ['Set content height 400px'],
  自定义标题和内容: ['Customize title and content'],
  使用默认配置的组件: ['Components with default configuration'],
  配置title参数和添加slot: ['Configure the title parameter and add slot'],
  自定义footer: ['Custom footer'],
  '配置footer插槽，footer插槽内容会随着高度的变化而变化': [
    'Configure the footer slot. The contents of the footer slot will change with the height',
  ],
  '是否显示组件，支持v-model写法': ['Whether to display components and support v-model writing'],
  自定义组件的标题: ['Title of custom component'],
  是否支持点击遮罩关闭组件: ['Whether it supports clicking the mask to close components'],
  是否允许出现遮罩: ['Whether mask is allowed'],
  组件的宽度: ['Width of component'],
  组件滑出的方向: ['Direction of component sliding out'],
  关闭前的钩子函数: ['Hook function before closing'],
  '	配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-sideslider-wrapper 上': [
    'Configure the custom style class name, and the incoming class will be added to the DOM. bk-sideslider-wrapper at the outermost layer of the component',
  ],
  '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-sideslider-wrapper 上': [
    'Configure the custom style class name, and the incoming class will be added to the DOM. bk-sideslider-wrapper at the outermost layer of the component',
  ],
  '控制 sidslider 是否出现在 body 内': ['Control whether the sidslider appears in the body'],
  '设置侧栏的z-index值，在transfer为true的情况下，改值会自动+1': [
    'Set the z-index value of the sidebar. When the transfer is true, the value will automatically+1',
  ],
  显示组件后的回调函数: ['Display the callback function after the component'],
  关闭组件后的回调函数: ['Callback function after closing component'],
  关闭组件后动画结束的回调函数: ['Callback function for ending animation after closing component'],
  头部插槽: ['Head slot'],
  底部插槽: ['Bottom slot'],
};

const Transfer: LANG = {
  默认配置: ['Default configuration'],
  普通数组配置: ['Normal array configuration'],
  自定义选项模板: ['Custom Options Template'],
  源列表: ['Source list'],
  目标列表: ['Target list'],
  流水线: ['Assembly line'],
  代码库: ['Code base'],
  代码检查: ['Code check'],
  容器服务: ['Container service'],
  版本仓库: ['Version warehouse'],
  凭证管理: ['Voucher management'],
  版本体验: ['Version experience'],
  环境管理: ['Environmental management'],
  质量红线: ['Quality red line'],
  编译加速: ['Compilation acceleration'],
  服务列表: ['Service list'],
  企业微信列表: ['Enterprise WeChat List'],
  已选服务: ['Selected services'],
  已选人员: ['Selected person'],
  未选择任何项: ['No item selected'],
  未选择任何服务: ['No service selected'],
  选择全部: ['Select All'],
  全部移除: ['Remove All'],
  左侧列表: ['List on the left'],
  右侧列表: ['List on the right'],
  左侧带搜索: ['Left band search'],
  'Transfer 属性': ['Transfer Attributes'],
  'Transfer 事件': ['Transfer Events'],
  'Transfer 插槽': ['Transfer Slots'],
  '顶部 title': ['Top title'],
  无数据时显示文案: ['Show copy when there is no data'],
  '排序所依据的 key': ['Key by which to sort'],
  '具有唯一标识的 key 值': ['Key value with unique identity'],
  '配置 slot为 source-option 或 target-option 可自定义 选项 内容。': [
    'Configure the slot as source-option or target-option to customize the option content.',
  ],
  '默认配置 source-list 和 display-key，source-list 为必传 source-list 可以是普通数组(普通数组会自动去重)。当 source-list 为普通数组时，display-key 可不传。':
    [
      'The source-list and display-key are configured by default. The source-list is required. The source-list can be a common array (the common array will be automatically de-duplicated). When source-list is a common array, display-key can not be passed.',
    ],
  '配置 target-list 以及设置排序': ['Configure target-list and set sorting'],
  '配置 sortable 以及 sort-key 使得操作数据时数据的排序不变，配置 target-list 设置默认选择的数据。sortable 为 true 时开启排序功能，为 false 时则关闭，sort-key 为排序所依据的 key 值。注意：当 source-list 为普通数组时，开启排序时默认按照值排序，此时不需要传 sort-key。':
    [
      'Configure sortable and sort-key to keep the sorting of data unchanged during data operation, and configure target-list to set the data selected by default. When sortable is true, the sorting function is turned on, and when false, it is turned off. sort-key is the key value on which to sort. Note: When source-list is a common array, sorting by value is the default when sorting is enabled. At this time, it is not necessary to pass sort-key.',
    ],
  '通过双栏穿梭选择框，利用更大的空间展示更多可选项、已选项的信息。': [
    'Through the double-column shuttle selection box, use more space to display more optional and selected information.',
  ],
  '此时根据值排序；display-key、sort-key、setting-key 不需要传。': [
    'In this case, sort by value; Display-key, sort-key and setting-key do not need to be transferred.',
  ],
  '自定义 header 和无数据时显示内容': ['Customize the header and display the content when there is no data'],
  '配置 slot 为 left-header 或 right-header 可自定义 header 内容，配置 slot 为 left-empty-content 和 right-empty-content 可自定义数据为空时所显示的内容(注意：当配置了 slot 时，其 title 和 empty-content 配置不会生效)':
    [
      'Configure the slot as left-header or right-header to customize the header content, and configure the slot as left-empty-content and right-empty-content to customize the content displayed when the data is empty (note: when the slot is configured, its title and empty-content configuration will not take effect)',
    ],
  '是否允许左侧搜索（以display-key来匹配）': ['Allow left search (match with display-key)'],
  是否设置排序: ['Set sorting'],
  '穿梭框数据源(必传)': ['Transfer data source (required)'],
  '已选择的数据（唯一标识 setting-key 的数组），可以使用v-mode:targetList绑定': [
    'The selected data (an array that uniquely identifies the setting-key) can be bound with v-mode: targetList',
  ],
  '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-transfer 上': [
    'Configure the custom style class name, and the incoming class will be added to the DOM. bk-transfer at the outermost layer of the component',
  ],
  '配置 searchable 启用搜索功能': ['Configure searchable to enable search function'],
  左侧头部插槽: ['Left head slot'],
  右侧头部插槽: ['Right head slot'],
  左侧无数据时插槽: ['Slot when there is no data on the left side'],
  右侧无数据时插槽: ['Slot when there is no data on the right side'],
  左侧选项卡插槽: ['Left tab slot'],
  右侧选项卡插槽: ['Right tab slot'],
  '右侧选择数据改变时触发(sourceList:未选择数据，targetList 表示所选数据；targetValueList表示唯一标识 setting-key 的数组)':
    [
      'Triggered when the data selected on the right changes (sourceList: no data selected, targetList represents the selected data; targetValueList represents an array that uniquely identifies setting-key)',
    ],
  '可使用v-mode:targetList绑定，也可以单独监听': [
    'You can use v-mode: targetList binding, or you can listen separately',
  ],
};

const Dialog: LANG = {
  对话框: ['Dialog'],
  上一步: ['Previous step'],
  下一步: ['Next step'],
  上一步按钮文字: ['Previous button text'],
  下一步按钮文字: ['Next button text'],
  对话框类型: ['Dialog type'],
  是否显示弹框: ['Whether to display the pop-up box'],
  当前步骤: ['Current step'],
  总步数: ['Total steps'],
  内容插槽: ['Content slot'],
  是否允许多个弹框同时存在: ['Whether to allow multiple frames to exist at the same time'],
  自定义size: ['Custom size'],
  异步: ['Asynchronous'],
  异步关闭: ['Asynchronous shutdown'],
  描述: ['Describe'],
  这是标题: ['This is the title'],
  文本标题: ['Text Title'],
  标题描述: ['Title Description'],
  自定义宽高: ['Custom width and height'],
  全屏弹框: ['Full-screen dialog'],
  全屏弹框标题: ['Full-screen dialog title'],
  嵌套弹框: ['Nested Dialog'],
  打开嵌套弹框: ['Open Nested Dialog'],
  打开侧弹框: ['Open the side spring frame'],
  操作型: ['Operational'],
  确认型: ['Confirm type'],
  流程型: ['Process type'],
  展示型对话框: ['Presentation dialog'],
  操作型对话框: ['Operational dialog'],
  确认型对话框: ['Confirmation dialog'],
  打开弹窗: ['Open dialog'],
  点击确认按钮时触发: ['Triggered when the Confirm button is clicked'],
  自定义内容以及弹框配置: ['Customized content and frame configuration'],
  弹框显示状态变化的回调函数: ['Callback function for status change of pop-up display'],
  配置按钮文案: ['Configure Button Text'],
  不允许拖拽: ['Dragging is not allowed'],
  进度一: ['Progress I'],
  进度二: ['Progress II'],
  进度三: ['Progress III'],
  进度四: ['Progress IV'],
  描述1: ['Description 1'],
  描述2: ['Description 2'],
  进度一的内容: ['Content of Progress I'],
  进度二的内容: ['Content of Progress II'],
  进度三的内容: ['Content of Progress III'],
  进度四的内容: ['Content of Progress IV'],
  点击确定后: ['After clicking OK'],
  秒关闭: ['seconds off'],
  文字个数不超过8个汉字: ['The number of characters shall not exceed 8 Chinese characters'],
  '嵌套的弹框内容~': ['Nested Dialog contents~'],
  'Dialog 属性': ['Dialog Attributes'],
  'Dialog 事件': ['Dialog Events'],
  'Dialog 插槽': ['Dialog Slots'],
  '描述-嵌套2': ['Description - Nested 2'],
  '描述-嵌套3': ['Description - Nested 3'],
  '工具栏插槽，顶部区域': ['Toolbar slot, top area'],
  '点击 取消，右上角的关闭 icon 或 按 esc 触发': [
    'Click Cancel, close icon in the upper right corner or press ESC to trigger',
  ],
  '对话框分为4种类型。通过 dialogType 属性 show，operation，confirm，process 进行配置，默认 operation 类型。': [
    'There are four types of dialog boxes. Configure through the dialogType attribute show, operation, confirm, and process. The default operation type.',
  ],
  '流程型对话框中，点击上一步触发': ['In the process dialog box, click Previous to trigger'],
  '流程型对话框中，点击下一步触发': ['In the process dialog box, click Next to trigger'],
  '默认配置的对话框。通过 theme 属性配置弹框中不同的主题确认按钮；通过 quickClose 配置是否允许点击遮罩关闭弹框，默认为 true。通过 escClose 配置是否启用 esc 按键关闭弹框，默认为 true。':
    [
      'The default configuration dialog box. Configure different theme confirmation buttons in the pop-up box through the theme attribute; Configure whether to allow clicking the mask to close the pop-up box through quickClose. The default value is true. Configure whether to enable the esc button to close the pop-up box through escClose. The default value is true.',
    ],
  '对话框分为4个尺寸。通过 size 属性 normal, small, medium, large 进行配置，也可通过 width, height 自定义宽高。': [
    'The dialog box is divided into four dimensions. It can be configured through the size attributes normal, small, medium, large, and width and height can also be customized through width and height.',
  ],
  'primary 主题，点击遮罩不会关闭弹框，esc 按键会关闭弹框': [
    'Primary theme, clicking the mask will not close the pop-up box, and the esc button will close the pop-up box',
  ],
  '通过设置 draggable 属性来设置是否允许弹框拖拽。通过 closeIcon 属性设置是否显示右上角的关闭 icon。': [
    'Set whether dragging of the pop-up box is allowed by setting the draggable property. Set whether to display the closing icon in the upper right corner through the closeIcon property.',
  ],
  '通过 loading 属性配置异步关闭效果，开启则需手动设置value来关闭对话框。': [
    'Configure the asynchronous closing effect through the loading property. To open it, you need to manually set value to close the dialog box.',
  ],
  '通过 fullscreen 属性配置全屏弹框，当设置为全屏弹框时，draggable 配置不生效即弹框不能拖动。': [
    'The full-screen pop-up is configured through the fullscreen attribute. When it is set to full-screen pop-up, the draggable configuration does not take effect, that is, the pop-up cannot be dragged. "',
  ],
  '通过 multi-instance 配置是否嵌套弹框同时存在，默认为 true，多个弹框叠加，设置为 false 只保留最后一个。': [
    'Configure whether nested frames exist at the same time through multi-instance. The default is true. Multiple frames are superimposed, and only the last one is retained if set to false.',
  ],
  '【首部及导言】': ['[First part and introduction]'],
  '【欢迎您使用腾讯蓝鲸智云软件及服务。】': ['[Welcome to Tencent Blue Whale Smart Cloud software and services.]'],
  '为使用腾讯蓝鲸智云软件（以下简称本软件）及服务，您应当阅读并遵守《腾讯蓝鲸智云软件许可及服务协议（以下简称本协议），以及《腾讯服务协议》':
    [
      'In order to use Tencent Blue Whale Smart Cloud Software (hereinafter referred to as the Software) and services, you should read and abide by Tencent Blue Whale Smart Cloud Software License and Service Agreement (hereinafter referred to as the Agreement) and Tencent Service Agreement',
    ],
  '（以下简称本协议），以及《腾讯服务协议》。 请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款，以及开通或使用某项服务的单独协议， 并选择接受或不接受。限制、免责条款可能以加粗形式提示您注意。':
    [
      '(hereinafter referred to as the Agreement), and Tencent Service Agreement. Please carefully read and fully understand the contents of the terms, especially the terms of exemption or limitation of liability, as well as the separate agreement for opening or using a certain service, and choose to accept or not to accept. Limitations and exclusions may remind you in bold form.',
    ],
  '除非您已阅读并接受本协议所有条款，否则您无权下载、安装或使用本软件及相关服务。': [
    'Unless you have read and accepted all the terms of this agreement, you have no right to download, install or use the software and related services.',
  ],
  '您的下载、安装、使用、登录等行为即视为您已阅读并同意上述协议的约束。': [
    'Your download, installation, use, login and other actions are deemed to be that you have read and agreed to the above agreement.',
  ],
  '一、【协议的范围】': ['I. [Scope of Agreement]'],
  '1.1【协议适用主体范围】': ['1.1 [Scope of applicable subjects of the agreement]'],
  '1.2【协议关系及冲突条款】': ['1.2 [Agreement relationship and conflict clauses]'],
  '是其不可分割的组成部分是其不可分割的组成部分。': ['It is an integral part of it.'],
  '欢迎您使用腾讯蓝鲸智云软件及服务。': ['Welcome to Tencent Blue Whale Smart Cloud software and services.'],
  '为使用腾讯蓝鲸智云软件（以下简称本软件）及服务，您应当阅读并遵守《腾讯蓝鲸智云软件许可及服务协议》': [
    'In order to use Tencent Blue Whale Smart Cloud Software (hereinafter referred to as the Software) and services, you should read and abide by the Tencent Blue Whale Smart Cloud Software License and Service Agreement',
  ],
  '为使用腾讯蓝鲸智云软件（以下简称本软件）及服务，您应当阅读并遵守《腾讯蓝鲸智云软件许可及服务协议（以下简称本协议），以及《腾讯服务协议》。':
    [
      'In order to use Tencent Blue Whale Smart Cloud Software (hereinafter referred to as the Software) and services, you should read and abide by Tencent Blue Whale Smart Cloud Software License and Service Agreement (hereinafter referred to as the Agreement) and Tencent Service Agreement.',
    ],
  '以下简称本协议），以及《腾讯服务协议》。请您务必审慎阅读、充分理解各条款内容，': [
    'Hereinafter referred to as the Agreement), and Tencent Service Agreement. Please read carefully and fully understand the contents of each clause,',
  ],
  '特别是免除或者限制责任的条款，以及开通或使用某项服务的单独协议，并选择接受或不接受。': [
    'In particular, the terms of exemption or limitation of liability, as well as the separate agreement for opening or using a certain service, and choose to accept or not to accept.',
  ],
  '限制、免责条款可能以加粗形式提示您注意。': ['Limitation and exemption clauses may remind you in bold form'],
  '除非您已阅读并接受本协议所有条款，否则您无权下载、安装或使用本软件及相关服务。您的下载、安装、使用、登录等行为即视为您已阅读并同意上述协议的约束。':
    [
      'Unless you have read and accepted all the terms of this agreement, you have no right to download, install or use the software and related services. Your download, installation, use, login and other actions are deemed to be that you have read and agreed to the above agreement.',
    ],
  '本协议被视为《腾讯服务协议》（链接地址:http://www.qq.com/contract.shtml，若链接地址变更的，': [
    'This agreement is regarded as Tencent Service Agreement (link address: http://www.qq.com/contract.shtml , if the link address is changed,',
  ],
  '本协议是您与腾讯之间关于您下载、安装、使用、复制本软件，以及使用腾讯相关服务所订立的协议。': [
    'This agreement is the agreement between you and Tencent regarding your download, installation, use, copy of the software and use of Tencent related services.',
  ],
  '则以变更后的链接地址所对应的内容为准；其他链接地址变更的情形，均适用前述约定。）的补充协议，': [
    'Then the content corresponding to the changed link address shall prevail; In other cases where the link address is changed, the above agreement shall apply.) Supplementary agreement,',
  ],
};

export default {
  ...Loading,
  ...Alert,
  ...Exception,
  ...Card,
  ...Popover,
  ...Message,
  ...InfoBox,
  ...Notify,
  ...Slider,
  ...SideSlider,
  ...Transfer,
  ...Dialog,
};
