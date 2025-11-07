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
    title: '可查看的抽屉',
    description: '承载展示性的信息内容',
    props: {
      title: '我是标题',
      renderDirective: 'if',
      transfer: false,
    },
    slots: {
      default: `hello world!!!`,
    },
  },
  {
    title: '可操作的抽屉',
    description: '承载需要编辑或操作的表单',
    props: {
      title: '我是标题',
      renderDirective: 'if',
      transfer: false,
    },
    slots: {
      default: `
        <bk-form>
          <bk-form-item
            label="姓名"
            property="name"
          >
            <bk-input
              placeholder="请输入"
              clearable
            />
          </bk-form-item>
          <bk-form-item label="性别">
            <bk-radio-group>
              <bk-radio label="男" />
              <bk-radio label="女" />
            </bk-radio-group>
          </bk-form-item>
        </bk-form>
      `,
    },
    dependent: {
      components: ['form', 'input', 'radio'],
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'is-show',
    description: '是否显示组件，支持v-model写法',
    type: 'boolean',
    default: false,
    isSupportVModel: true,
  },
  {
    name: 'title',
    description: '自定义组件的标题',
    type: 'string',
    default: '',
  },
  {
    name: 'width',
    description: '组件的宽度',
    type: 'number',
    default: '',
  },
  {
    name: 'direction',
    description: '组件滑出的方向',
    type: 'string',
    default: 'right',
    options: ['left', 'right'],
  },
  {
    name: 'esc-close',
    description: '是否允许 esc 按键关闭弹框',
    type: 'boolean',
    default: true,
  },
  {
    name: 'show-mask',
    description: '是否允许出现遮罩',
    type: 'boolean',
    default: true,
  },
  {
    name: 'quick-close',
    description: '是否允许点击遮罩关闭弹框',
    type: 'boolean',
    default: true,
  },
  {
    name: 'transfer',
    description: '控制 sidslider 是否出现在 body 内',
    type: 'boolean',
    default: false,
  },
  {
    name: 'z-index',
    description: '设置侧栏的z-index值，在transfer为true的情况下，改值会自动+1',
    type: 'number',
  },
  {
    name: 'backgroundColor',
    description: '内容区背景颜色',
    type: 'string',
  },
  {
    name: 'render-directive',
    description: '弹框的渲染方式',
    type: 'string',
    default: 'if',
    options: ['if', 'show'],
  },
  {
    name: 'before-close',
    description: '关闭前的钩子函数',
    type: 'function',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'closed',
    description: '组件关闭',
    params: [],
  },
  {
    name: 'update:isShow',
    description: '组件是否显示',
    params: [{ name: 'isColsed', type: 'boolean' }],
  },
  {
    name: 'shown',
    description: '显示组件后的回调函数',
    params: [],
  },
  {
    name: 'hidden',
    description: '关闭组件后的回调函数',
    params: [],
  },
  {
    name: 'animation-end',
    description: '关闭组件后动画结束的回调函数',
    params: [],
  },
];

// 组件插槽
const slots = [
  {
    name: 'default',
    description: '默认插槽',
  },
  {
    name: 'header',
    description: '头部插槽',
  },
  {
    name: 'footer',
    description: '底部插槽',
  },
];

// 组件自定义的复杂类型
const types = [];

// 组件分组
const group = NavGroupMeta.Feedback;

// 组件名称
const name = 'sideslider';

// 组件标签
const title = 'Sideslider';

// 组件中文标签
const titleCN = '侧栏';

// 组件描述
const description = 'Sideslider组件， 提供一个从两侧滑入的组件，供用户填写/查看更多信息。';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  presets,
  types,
  description,
  slots,
};
export default wiki;
