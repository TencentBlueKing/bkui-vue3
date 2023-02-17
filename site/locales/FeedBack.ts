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
  'trigger click': ['trigger click'],
  'mouse click': ['mouse click'],
  当鼠标点击: ['When the mouse clicks'],
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
};

const Slider: LANG = {};

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
};
