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

const Button: LANG = {
  常用的操作按钮: ['Common operation buttons'],
  基础按钮: ['Basic Button'],
  主要按钮: ['Primary Button'],
  禁用按钮: ['Disabled Button'],
  禁用状态: ['Disabled Button'],
  '基础按钮提供 5 种主题，由 theme 属性来定义，可选的主题有 default, primary, warning, success, danger，默认为 default':
    [
      'The basic button provides five themes, which are defined by the theme attribute. The optional themes are default, primary, warning, success, and danger. The default is default',
    ],
  '配置 disabled 属性来使按钮禁用': ['Configure the disabled property to disable the button'],
  图标按钮: ['Icon Button'],
  '可以在slot自定义icon ，设置loading 的时候，会显示 loading 效果。可以用loading-mode【spin 或者 default 】属性指定Loading效果':
    [
      'You can customize the icon in the slot. When setting the loading, the loading effect will be displayed. You can use the loading-mode [spin or default] attribute to specify the loading effect',
    ],
  按钮组: ['Button Group'],
  '可以使用 ButtonGroup实现按钮组效果': ['You can use ButtonGroup to achieve button group effect'],
  尺寸: ['Size'],
  '可以使用 size 属性来定义按钮的尺寸，可接受 small large': [
    'You can use the size attribute to define the size of the button. Small large is acceptable',
  ],
  文字按钮: ['Text Button'],
  '通过设置 text 属性来配置文字按钮。文字按钮同样提供 5 种主题，由 theme 属性来定义，可选的主题有 default,primary,warning,success,danger，默认为 default。另外可以使用 disabled 属性来定义按钮是否禁用，它接受一个 Boolean 值':
    [
      'Configure the text button by setting the text property. The text button also provides five themes, which are defined by the theme attribute. The optional themes are default, primary, warning, success, and danger. The default is default. In addition, you can use the disabled attribute to define whether the button is disabled. It accepts a Boolean value',
    ],
  加载中状态: ['Loading Button'],
  '可以使用 loading 属性来定义按钮是否显示加载中状态，它接受一个 Boolean 值。同时可以通过loading-mode属性指定loading指示器类型':
    [
      'You can use the loading attribute to define whether the button displays the loading status. It accepts a Boolean value. At the same time, the loading indicator type can be specified through the loading-mode attribute',
    ],
  反色按钮: ['Inverted Button'],
  '通过配置 outline 属性来实现反色按钮的效果': [
    'Realize the effect of the reverse color button by configuring the outline attribute',
  ],
  'Button 属性': ['Button Attributes'],
  'Button 事件': ['Button Events'],
  新增: ['Add'],
  下拉: ['DropDown'],
  'mouseHover 按钮样式, 当设置了此属性时，theme 和 text 失效': [
    'MouseHover button style. When this property is set, theme and text are invalid',
  ],
  'mousehover 颜色自定义': ['Mousehover color customization'],
  '提供 4 种 mousehover 颜色主题，由 hover-theme 属性来定义，可选的主题有 primary, warning, success, danger。当设置了 hover-theme 属性时，theme 和 text 失效。':
    [
      'Four mousehover color themes are provided, which are defined by the hover-theme attribute. The optional themes are primary, warning, success, and danger. When the homer-theme property is set, theme and text are invalid.',
    ],
  是否不可用: ['Not available'],
  是否为文字按钮: ['Is it a text button'],
  是否为反色按钮: ['Is it a reverse color button'],
  按钮主题: ['Button theme'],
  按钮尺寸大小: ['Button size'],
  点击时触发事件: ['Trigger event when clicked'],
  小尺寸: ['Small Size'],
  大尺寸: ['Large Size'],
  默认按钮: ['Default Button'],
  成功: ['Success'],
  北京: ['Beijing'],
  上海: ['Shanghai'],
  广州: ['Guangzhou'],
  深圳: ['Shenzhen'],
  其他: ['Other'],
  参数: ['Parameter'],
  说明: ['Explain'],
  类型: ['Type'],
  可选值: ['Optional value'],
  默认值: ['Default'],
  加载中: ['Loading'],
};

const Icon: LANG = {
  Icon展示: ['Icon Display'],
  ['Icon组件， 可以通过组件的使用方式按需加载。']: [
    'Icon components can be loaded on demand according to their usage.',
  ],
  ['这里展示了我们UI所用到的所有Icon, 点击复制使用']: ['All icons used in our UI are shown here. Click Copy to use'],
  点击复制使用Icon组件: ['Click Copy to use Icon component'],
  属性: ['Property'],
  svg元素的宽度: ['Width of svg element'],
  svg元素的高度: ['Height of svg element'],
  svg元素的填充颜色: ['Fill color of svg element'],
};

export default {
  ...Button,
  ...Icon,
};
