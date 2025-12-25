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

const style = `
  .bk-grid-container {
    width: 100%;
  }
    
  .content {
    height: 100%;
    font-size: 12px;
    line-height: 60px;
    background-color: #e1ecff;
    border-radius: 2px;
  }

  .bk-grid-row {
    text-align: center;
  }

  .bk-grid-row + .bk-grid-row {
    margin-top: 30px;
  }
`;

// 组件示例
const presets = [
  {
    title: '基础用法',
    description: '创建基础的栅格布局。默认采用 24 栅格系统，将区域进行 24 等分。',
    props: {
      col: 24,
    },
    slots: {
      default: `
        <bk-row>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
          <bk-col>
            <div class="content">1/24</div>
          </bk-col>
        </bk-row>
      `,
    },
    style,
  },
  {
    title: '自定义设置栅格数以及整个栅格容器的左右边距',
    description:
      '通过 bk-container 的 col 属性来设置栅格数，这里设置成 12，将区域进行 12 等分，通过 bk-container 的 margin 属性来整个栅格容器的左右边距。',
    props: {
      col: 12,
      margin: 6,
    },
    slots: {
      default: `
        <bk-row>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
        </bk-row>
      `,
    },
    style,
  },
  {
    title: '自定义设置栅格之间的边距以及每个栅格的占位数',
    description: '通过 bk-container 的 gutter 属性来设置栅格之间的间隔，通过 bk-col 的 span 属性来设置栅格的占位数。',
    props: {
      col: 12,
      margin: 6,
    },
    slots: {
      default: `
        <bk-row>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
          <bk-col>
            <div class="content">1/12</div>
          </bk-col>
        </bk-row>
        <bk-row>
          <bk-col :span="7">
            <div class="content">7/12</div>
          </bk-col>
          <bk-col :span="5">
            <div class="content">5/12</div>
          </bk-col>
        </bk-row>
      `,
    },
    style,
  },
  {
    title: '自定义设置栅格的顺序以及栅格的偏移',
    description: '通过 bk-col 的 push 和 pull 属性来设置栅格的顺序。通过 bk-col 的 offset 属性设置栅格的偏移。',
    props: {
      col: 12,
    },
    slots: {
      default: `
        <bk-row>
          <bk-col
            :push="5"
            :span="7"
          >
            <div class="content">7/12 (push: 5)</div>
          </bk-col>
          <bk-col
            :pull="7"
            :span="5"
          >
            <div class="content">5/12 (pull: 7)</div>
          </bk-col>
        </bk-row>
        <bk-row>
          <bk-col
            :push="9"
            :span="3"
          >
            <div class="content">3/12 (push: 9)</div>
          </bk-col>
          <bk-col
            :pull="3"
            :span="9"
          >
            <div class="content">9/12 (pull: 3)</div>
          </bk-col>
        </bk-row>
        <bk-row>
          <bk-col
            :offset="3"
            :span="4"
          >
            <div class="content">4/12 (offset: 3)</div>
          </bk-col>
          <bk-col :span="5">
            <div class="content">5/12</div>
          </bk-col>
        </bk-row>
        <bk-row>
          <bk-col
            :push="8"
            :span="4"
          >
            <div class="content">4/12 (push: 8)</div>
          </bk-col>
          <bk-col
            :offset="-4"
            :span="3"
          >
            <div class="content">3/12 (offset: -4)</div>
          </bk-col>
        </bk-row>
      `,
    },
    style,
  },
  {
    title: 'flex 布局',
    description: '通过 bk-container 的 flex 属性来开启 flex 布局，配合 bk-col, bk-row 的嵌套使用来实现更复杂的布局。',
    props: {
      col: 12,
      flex: true,
    },
    slots: {
      default: `
        <bk-row>
          <bk-col :span="4">
            <div class="content">4/12</div>
          </bk-col>
          <bk-col :span="8">
            <bk-row style="margin-bottom: 10px">
              <bk-col :span="4">
                <div class="content">4/12</div>
              </bk-col>
              <bk-col :span="4">
                <div class="content">4/12</div>
              </bk-col>
            </bk-row>
            <bk-row>
              <bk-col :span="3">
                <div class="content">3/12</div>
              </bk-col>
              <bk-col :span="5">
                <div class="content">5/12</div>
              </bk-col>
            </bk-row>
          </bk-col>
        </bk-row>
      `,
    },
    style,
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'col',
    description: '栅格数，默认 24',
    type: 'number',
    default: 24,
  },
  {
    name: 'gutter',
    description: '栅格间距，单位 px，左右平分',
    type: 'number',
    default: 20,
  },
  {
    name: 'margin',
    description: '栅格容器的左右外边距',
    type: 'number',
    default: 20,
  },
  {
    name: 'flex',
    description: '控制 row 是否使用 flex 布局',
    type: 'boolean',
    default: false,
  },
  {
    name: 'extCls',
    description: '外部设置的 class name',
    type: 'string',
  },
];

// 组件事件，用来自动生成事件文档
const emits: IComponentWiki['emits'] = [];

// 组件插槽，用来自动生成插槽文档
const slots: IComponentWiki['slots'] = [
  {
    name: 'default',
    description: '默认插槽，用于放置内容',
  },
];

// 组件分组
const group = NavGroupMeta.Layout;

// 组件名称
const name = 'container';

// 组件标签
const title = 'Container';

// 组件中文标签
const titleCN = '栅格布局';

// 组件描述
const description = '栅格布局系统，基于 24 栅格系统，通过 Container、Row、Col 组件实现灵活的布局。';

const children = [
  {
    name: 'col',
    props: [
      {
        name: 'span',
        description: '栅格的占位格数，可选值为 0~24 的整数，为 0 时，则为 col 相当于 width: 100%',
        type: 'number',
        default: 1,
      },
      {
        name: 'offset',
        description: '栅格的偏移',
        type: 'number',
        default: 0,
      },
      {
        name: 'pull',
        description: '栅格向左移动格数',
        type: 'number',
        default: 0,
      },
      {
        name: 'push',
        description: '栅格向右移动格数',
        type: 'number',
        default: 0,
      },
    ],
    emits: [],
    slots: [
      {
        name: 'default',
        description: '默认插槽，用于放置内容',
      },
    ],
  },
];

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  slots,
  presets,
  description,
  children,
};

export default wiki;
