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

const list = [
  { name: '方案成熟', content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维' },
  {
    name: '覆盖全面',
    content:
      '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
  },
  {
    name: '开放平台',
    content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
  },
];

// 组件示例
const presets = [
  {
    title: '基础型',
    description: '基础的折叠面板',
    props: {
      list,
      modelValue: [],
      accordion: false,
    },
  },
  {
    title: '线条型',
    description: '通过线条分隔面板',
    props: {
      hasHeaderBorder: true,
      list,
      modelValue: [],
      accordion: false,
    },
  },
  {
    title: '色块型',
    description: '通过标题栏色块分隔面板',
    props: {
      useBlockTheme: true,
      list,
      accordion: false,
    },
  },
  {
    title: '卡片型',
    description: '通过卡片样式分隔面板',
    props: {
      useCardTheme: true,
      list,
      modelValue: [],
      accordion: false,
    },
  },
  {
    title: '自定义图标',
    description: '通过 headerIcon 配置自定义图标',
    props: {
      headerIcon: 'angle-double-right',
      list,
      modelValue: [],
      accordion: false,
    },
  },
  {
    title: '图标位置',
    description: '通过 headerIconAlign 配置图标位置',
    props: {
      headerIconAlign: 'right',
      list,
      modelValue: [],
    },
  },
  {
    title: '是否使用手风琴模式',
    description: '通过 accordion 配置是否使用手风琴模式',
    props: {
      accordion: true,
      list,
      modelValue: [0],
    },
  },
  {
    title: '自定义面板标题',
    description: '通过 title 插槽配置面板标题',
    props: {
      list,
      modelValue: [],
    },
    slots: {
      title: `
        <span> {{ data.name }} 自定义title</span>
      `,
    },
  },
  {
    title: '点击事件',
    description: '通过点击事件获取当前点击项',
    props: {
      list,
      modelValue: [],
    },
    events: {
      itemClick: `
        (item) => {
          BkMessage({
            message: \`当前点击\${item.name}\`,
            offsetY: 80,
          });
        }
      `,
    },
    dependent: {
      components: ['message'],
    },
  },
  {
    title: '列表不可点击',
    description: '通过 disabled 配置列表不可点击',
    props: {
      list: [
        {
          name: '方案成熟',
          content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
          disabled: true,
        },
        {
          name: '覆盖全面',
          content:
            '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。',
        },
        {
          name: '开放平台',
          content: '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。',
        },
      ],
      modelValue: [],
    },
  },
  {
    title: 'collapse-panel 组件',
    description: '通过 collapse-panel 组件配置面板',
    props: {
      modelValue: [],
    },
    slots: {
      default: `
        <bk-collapse-panel name="0">
          <span>0-方案成熟</span>
          <template #content>
            <div>
              拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维
            </div>
          </template>
        </bk-collapse-panel>
        <bk-collapse-panel name="1">
          <span>1-覆盖全面</span>
          <template #content>
            <div>
              从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。
            </div>
          </template>
        </bk-collapse-panel>
        <bk-collapse-panel name="2">
          <span>2-开放平台</span>
          <template #content>
            <div>
              开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。
            </div>
          </template>
        </bk-collapse-panel>
      `,
    },
  },
  {
    title: '面板插槽',
    description: '通过插槽配置面板',
    props: {
      list,
      modelValue: [],
    },
    slots: {
      default: `
          <bk-collapse-panel name="0">
            <span>0-方案成熟</span>
            <template #content>
              <div>
                拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维
              </div>
            </template>
          </bk-collapse-panel>
          <bk-collapse-panel name="1">
            <template #header>
              <div style="display: flex; justify-content: space-between; align-items: center">
                <div>1-自定义header</div>
              </div>
            </template>
            <template #content>
              <div>
                从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。
              </div>
            </template>
          </bk-collapse-panel>
        `,
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'list',
    description: '渲染列表，对象数组或字符串数组，字符串数组默认会增加 name 字段',
    type: 'Array<any>',
    default: '[]',
  },
  {
    name: 'idFiled',
    description: 'ID 字段名',
    type: 'string',
    default: '$index',
  },
  {
    name: 'titleField',
    description: '标题字段名',
    type: 'string',
    default: 'name',
  },
  {
    name: 'contentField',
    description: '内容字段名，默认渲染内容，不配置时自动读取 content 字段',
    type: 'string',
    default: 'content',
  },
  {
    name: 'modelValue',
    description: '当当前激活Index',
    type: 'number | Array<number | string>',
    default: '[]',
    isSupportVModel: true,
  },
  {
    name: 'accordion',
    description: '是否使用手风琴效果',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'hasHeaderBorder',
    description: '是否显示头部边框线条',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'hasHeaderHover',
    description: '是否启用头部 hover 效果',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'headerIcon',
    description: '自定义头部图标',
    type: 'string',
    default: '',
  },
  {
    name: 'useCardTheme',
    description: '是否使用卡片样式主题',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'headerIconAlign',
    description: '头部图标对齐位置',
    type: 'string',
    options: ['left', 'right'],
    default: 'left',
  },
  {
    name: 'useBlockTheme',
    description: '是否使用色块样式',
    type: 'boolean',
    default: 'false',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'item-click',
    description: '面板项点击时触发',
    params: [
      {
        name: 'item',
        type: 'any',
      },
    ],
  },
  {
    name: 'update:modelValue',
    description: '展开面板变化时触发',
    params: [
      {
        name: 'localActiveItems',
        type: 'Array<any>',
      },
    ],
  },
  {
    name: 'after-leave',
    description: '面板收起动画完成后触发',
    params: [],
  },
  {
    name: 'before-enter',
    description: '面板展开动画开始前触发',
    params: [],
  },
];

// 组件插槽，用来自动生成插槽文档
const slots = [
  {
    name: 'default',
    description: '自定义标题内容（优先级高于 title 插槽）',
    params: [
      {
        name: 'item',
        type: 'any',
        description: '当前项数据',
      },
      {
        name: 'index',
        type: 'number',
        description: '当前项索引',
      },
    ],
  },
  {
    name: 'title',
    description: '自定义标题内容',
    params: [
      {
        name: 'item',
        type: 'any',
        description: '当前项数据',
      },
      {
        name: 'index',
        type: 'number',
        description: '当前项索引',
      },
    ],
  },
  {
    name: 'content',
    description: '自定义内容区域',
    params: [
      {
        name: 'item',
        type: 'any',
        description: '当前项数据',
      },
      {
        name: 'index',
        type: 'number',
        description: '当前项索引',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Data;

// 组件名称
const name = 'collapse';

// 组件标签
const title = 'Collapse';

// 组件中文标签
const titleCN = '折叠面板';

// 组件描述
const description = '折叠面板组件，用于展示可折叠的内容区域';

const children = [
  {
    name: 'collapse-panel',
    props: [
      {
        name: 'name',
        description: '面板名称，用于标识面板，可以是字符串或数字',
        type: 'number | string',
        default: '',
      },
      {
        name: 'title',
        description: '面板标题，可以是字符串或插槽',
        type: 'any',
        default: '',
      },
      {
        name: 'content',
        description: '面板内容，字符串形式',
        type: 'string',
        default: '',
      },
      {
        name: 'disabled',
        description: '是否禁用面板',
        type: 'boolean',
        default: 'false',
      },
      {
        name: 'isFormList',
        description: '是否从列表中渲染',
        type: 'boolean',
        default: 'false',
      },
      {
        name: 'renderDirective',
        description: '渲染指令，用于控制是否渲染组件',
        type: 'string',
        options: ['if', 'show'],
        default: '',
      },
      {
        name: 'modelValue',
        description: '面板的展开/收起状态',
        type: 'boolean',
        default: 'false',
      },
      {
        name: 'alone',
        description: '是否单独使用面板',
        type: 'boolean',
        default: 'false',
      },
      {
        name: 'icon',
        description: '自定义图标',
        type: 'string',
        default: 'angle-right',
      },
      {
        name: 'itemClick',
        description: '面板项点击时触发',
        type: 'function',
        default: '',
      },
    ],
    emits: [
      {
        name: 'update:modelValue',
        description: '展开状态变化时触发',
        params: [
          {
            name: 'isActive',
            type: 'boolean',
          },
        ],
      },
      {
        name: 'change',
        description: '展开状态变化时触发',
        params: [
          {
            name: 'data',
            type: '{ name: number | string }',
          },
        ],
      },
      {
        name: 'after-leave',
        description: '面板收起动画完成后触发',
        params: [],
      },
      {
        name: 'before-enter',
        description: '面板展开动画开始前触发',
        params: [],
      },
    ],
    slots: [
      {
        name: 'default',
        description: '自定义标题内容（优先级高于 header 插槽）',
        params: [],
      },
      {
        name: 'header',
        description: '自定义头部内容',
        params: [],
      },
      {
        name: 'content',
        description: '自定义内容区域',
        params: [],
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
