/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
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
import { NavGroupMeta, type IComponentWiki } from '@bkui-vue/shared';

// 组件示例
const presets = [
  {
    title: '单行输入框 input',
    description: '最基础的输入表单，仅支持输入一行文本',
    props: {
      modelValue: '',
      type: 'text',
      behavior: 'normal',
      placeholder: '请输入',
      maxlength: 10,
      minlength: 1,
      overMaxLengthLimit: true,
      prefix: 'https://',
      suffix: '.com',
      clearable: true,
    },
  },
  {
    title: '文本域 textarea',
    description: '支持输入多行文本',
    props: {
      modelValue: '',
      type: 'textarea',
      placeholder: '请输入',
      maxlength: 100,
      minlength: 10,
      overMaxLengthLimit: true,
      resize: true,
      clearable: true,
    },
  },
  {
    title: '数值输入框 numberinput',
    description: '只支持输入数值的文本框',
    props: {
      modelValue: '',
      type: 'number',
      max: 100,
      min: 0,
      precision: 2,
    },
  },
  {
    title: '密码输入框 passport',
    description: '用户密码的特殊场景',
    props: {
      modelValue: '',
      type: 'password',
      clearable: true,
    },
  },
  {
    title: '带Icon输入框',
    description: '支持前后缀图标的输入框',
    props: {
      modelValue: '',
      type: 'text',
    },
    slots: {
      prefix:
        '<span class="input-icon" style="display: flex; align-items: center; justify-content: center; padding-left: 8px; font-size: 16px; color: #c4c6cc;"><search /></span>',
      suffix:
        '<span class="input-icon" style="display: flex; align-items: center; justify-content: center; padding-right: 8px; font-size: 16px; color: #c4c6cc;"><info-line /></span>',
    },
    dependent: {
      components: ['icon'],
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'modelValue',
    description: '输入框绑定值',
    type: 'string',
    default: '',
    isSupportVModel: true,
  },
  {
    name: 'type',
    description: '输入框类型',
    type: 'string',
    options: ['text', 'textarea', 'password', 'number', 'email', 'url', 'date'],
    default: 'text',
  },
  {
    name: 'placeholder',
    description: '空白提示',
    type: 'string',
  },
  {
    name: 'disabled',
    description: '是否不可用',
    type: 'boolean',
  },
  {
    name: 'readonly',
    description: '是否只读',
    type: 'boolean',
  },
  {
    name: 'prefix',
    description: '前缀字符，当配置prefix slot时失效',
    type: 'string',
  },
  {
    name: 'suffix',
    description: '后缀字符，当配置suffix slot时失效',
    type: 'string',
  },
  {
    name: 'clearable',
    description: '是否可清除。数字输入框时，此配置不生效',
    type: 'boolean',
  },
  {
    name: 'maxlength',
    description: '最大输入长度',
    type: 'number',
  },
  {
    name: 'minlength',
    description: '最小输入长度',
    type: 'number',
  },
  {
    name: 'size',
    description: '输入框尺寸，只在 type!="textarea" 时有效',
    type: 'string',
    options: ['small', 'large'],
  },
  {
    name: 'name',
    description: '名称',
    type: 'string',
  },
  {
    name: 'precision',
    description: '保留小数位',
    type: 'number',
  },
  {
    name: 'show-word-limit',
    description: '是否显示输入字数统计，只在 type = "text" 或 type = "textarea" 时有效',
    type: 'boolean',
  },
  {
    name: 'over-max-length-limit',
    description: '超出最大字数限制后是否可以继续输入，结合maxlength使用',
    type: 'boolean',
  },
  {
    name: 'show-overflow-tooltips',
    description: '文本超出长度是否显示tooltips',
    type: 'boolean',
  },
  {
    name: 'autosize',
    description:
      '设置文本框 autosize 属性使得根据内容自动调整的高度。 你可以给 autosize 提供一个包含有最大行数和最小行数的对象，让输入框自动调整。注意：需要手动将resize设置为false',
    type: 'boolean | InputAutoSize',
    link: '/component/input/api#InputAutoSize',
  },
  {
    name: 'resize',
    description: '设置文本框是否可以自动调整高度，默认为true，设置为true时，autosize会失效',
    type: 'boolean',
  },
  {
    name: 'behavior',
    description: '简约风格设置(simplicity:简约 normal:正常 type=textarea时不生效)',
    type: 'string',
    options: ['simplicity', 'normal'],
  },
  {
    name: 'stopPropagation',
    description: '是否阻止事件冒泡',
    type: 'boolean',
  },
  {
    name: 'tooltipsOptions',
    description: 'tooltips配置项',
    type: 'Partial<tooltipsProps>',
    link: '/component/tooltips/api#tooltipsProps',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'update:modelValue',
    description: '更新modelValue值',
    params: [
      {
        name: 'value',
        type: 'string',
      },
    ],
  },
  {
    name: 'focus',
    description: '获取焦点时触发事件',
    params: [
      {
        name: 'event',
        type: 'FocusEvent',
      },
    ],
  },
  {
    name: 'blur',
    description: '失去焦点时触发事件',
    params: [
      {
        name: 'event',
        type: 'FocusEvent',
      },
    ],
  },
  {
    name: 'change',
    description: '值变更时触发事件',
    params: [
      {
        name: 'value',
        type: 'string',
      },
      {
        name: 'event',
        type: 'Event',
      },
    ],
  },
  {
    name: 'clear',
    description: '清空值时触发事件',
    params: [],
  },
  {
    name: 'input',
    description: '输入时触发事件',
    params: [
      {
        name: 'value',
        type: 'string',
      },
      {
        name: 'event',
        type: 'Event',
      },
    ],
  },
  {
    name: 'keypress',
    description: '按下键盘时触发',
    params: [
      {
        name: 'value',
        type: 'string',
      },
      {
        name: 'event',
        type: 'KeyboardEvent',
      },
    ],
  },
  {
    name: 'keydown',
    description: '按下键盘时触发事件',
    params: [
      {
        name: 'value',
        type: 'string',
      },
      {
        name: 'event',
        type: 'KeyboardEvent',
      },
    ],
  },
  {
    name: 'keyup',
    description: '按下键盘按键松开时触发事件',
    params: [
      {
        name: 'value',
        type: 'string',
      },
      {
        name: 'event',
        type: 'KeyboardEvent',
      },
    ],
  },
  {
    name: 'enter',
    description: '获取焦点时，按下回车时触发事件',
    params: [
      {
        name: 'value',
        type: 'string',
      },
      {
        name: 'event',
        type: 'KeyboardEvent',
      },
    ],
  },
  {
    name: 'paste',
    description: '粘贴内容时触发事件',
    params: [
      {
        name: 'value',
        type: 'string',
      },
      {
        name: 'event',
        type: 'ClipboardEvent',
      },
    ],
  },
  {
    name: 'compositionstart',
    description: '输入法编辑器开始新的输入合成时触发',
    params: [
      {
        name: 'event',
        type: 'CompositionEvent',
      },
    ],
  },
  {
    name: 'compositionupdate',
    description: '输入法编辑器输入合成更新时触发',
    params: [
      {
        name: 'event',
        type: 'CompositionEvent',
      },
    ],
  },
  {
    name: 'compositionend',
    description: '输入法编辑器完成或取消当前输入合成时触发',
    params: [
      {
        name: 'event',
        type: 'CompositionEvent',
      },
    ],
  },
];

const methods = [
  {
    name: 'focus',
    description: '组件聚集',
    params: [],
  },
  {
    name: 'blur',
    description: '失去焦点',
    params: [],
  },
  {
    name: 'clear',
    description: '清空内容	',
    params: [],
  },
];

const types = [
  {
    name: 'InputAutoSize',
    description: '自动调整文本域高度',
    fields: [
      {
        name: 'minRows',
        description: '最小行数',
        type: 'number',
      },
      {
        name: 'maxRows',
        description: '最大行数',
        type: 'number',
      },
    ],
  },
];

const slots = [
  {
    name: 'prefix',
    description: '前置插槽',
  },
  {
    name: 'suffix',
    description: '后置插槽',
  },
];
// 组件分组
const group = NavGroupMeta.Form;

// 组件名称
const name = 'input';

// 组件标签
const title = 'Input';

// 组件中文标签
const titleCN = '输入框';

// 组件描述
const description = '常用的输入框';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  presets,
  methods,
  slots,
  description,
  types,
};

export default wiki;
