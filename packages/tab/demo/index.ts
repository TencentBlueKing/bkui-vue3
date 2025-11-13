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

const tabSlot = `
  <bk-tab-panel name="mission" label="任务报表">
    任务报表
  </bk-tab-panel>
  <bk-tab-panel name="config" label="加速配置">
    加速配置
  </bk-tab-panel>
  <bk-tab-panel name="history" label="历史版本">
    历史版本
  </bk-tab-panel>
  <bk-tab-panel name="deleted" label="已归档加速任务">
    已归档加速任务
  </bk-tab-panel>
`;

// 组件示例
const presets = [
  {
    title: '选项卡样式',
    description:
      '通过配置 type 属性，设置选项卡样式。支持的属性有 card, border-card, unborder-card, vertical-card, card-grid',
    props: {
      active: 'mission',
      type: 'unborder-card',
    },
    slots: {
      default: tabSlot,
    },
  },
  {
    title: '选项卡位置',
    description:
      '通过配置 tab-position 属性，设置选项卡位置。支持的属性有 left, right, top。当 tab-position 属性配置为 left 和 right 时，addable 属性以及 closable 属性无效。',
    props: {
      active: 'mission',
      type: 'card-tab',
      'tab-position': 'left',
    },
    slots: {
      default: tabSlot,
    },
  },
  {
    title: '拖拽排序',
    description:
      'sortType 为replace时，为交换位置；为jump时，为插入当前位置。bk-tab :sortable=“true” 。tab 可拖拽排序。bk-tab-panel :unsortable=“true”,此选项不可排序',
    props: {
      active: 'mission',
      type: 'card',
      sortable: true,
    },
    slots: {
      default: tabSlot,
    },
  },
  {
    title: '自定义选项卡内容',
    description: '通过使用 slot 自定义选项卡内容',
    props: {
      active: 'mission',
      type: 'card',
      addable: true,
    },
    slots: {
      add: '<div>+ 新增</div>',
      setting: '<div style="margin: 0 10px">设置</div>',
      default: `
        <bk-tab-panel name="mission" label="任务报表">
          <template #label>
            <div>自定义标签: mission</div>
          </template>
          <template #panel>
            <div>自定义内容: 任务报表</div>
          </template>
        </bk-tab-panel>
        <bk-tab-panel name="config" label="加速配置">
          <template #label>
            <div>自定义标签: config</div>
          </template>
          <template #panel>
            <div>自定义内容: 加速配置</div>
          </template>
        </bk-tab-panel>
        <bk-tab-panel name="history" label="历史版本">
          <template #label>
            <div>自定义标签: history</div>
          </template>
          <template #panel>
            <div>自定义内容: 历史版本</div>
          </template>
        </bk-tab-panel>
        <bk-tab-panel name="deleted" label="已归档加速任务">
          <template #label>
            <div>自定义标签: deleted</div>
          </template>
          <template #panel>
            <div>自定义内容: 已归档加速任务</div>
          </template>
        </bk-tab-panel>
      `,
    },
  },
  {
    title: '带数字样式',
    description:
      '通过配置num属性设置是否显示数字，通过numDisplayType设置数字样式，支持的属性有bracket(括号)、square(方形)、elliptic(椭圆)。',
    props: {
      active: 'mission',
      type: 'border-card',
    },
    slots: {
      default: `
        <bk-tab-panel name="mission" label="任务报表" num="2" numDisplayType="bracket">
          任务报表
        </bk-tab-panel>
        <bk-tab-panel name="config" label="加速配置" num="4" numDisplayType="bracket">
          加速配置
        </bk-tab-panel>
        <bk-tab-panel name="history" label="历史版本" num="8" numDisplayType="square">
          历史版本
        </bk-tab-panel>
        <bk-tab-panel name="deleted" label="已归档加速任务" num="10" numDisplayType="elliptic">
          已归档加速任务
        </bk-tab-panel>
      `,
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'active',
    description: '选中的 tab',
    type: 'number | string',
    default: '',
    isSupportVModel: true,
  },
  {
    name: 'type',
    description: '选项卡样式',
    type: 'string',
    options: ['card', 'border-card', 'unborder-card', 'vertical-card', 'card-grid', 'card-tab'],
    default: 'border-card',
  },
  {
    name: 'tab-position',
    description: '选项卡位置',
    type: 'string',
    options: ['top', 'left', 'right'],
    default: 'top',
  },
  {
    name: 'closable',
    description: '动态删除选项卡',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'addable',
    description: '动态添加选项卡',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'sortable',
    description: '拖拽排序选项卡',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'sort-type',
    description: '拖拽排序选项卡',
    type: 'string',
    options: ['insert', 'replace'],
    default: 'replace',
  },
  {
    name: 'label-height',
    description: '选项卡 高度',
    type: 'number',
    default: '',
  },
  {
    name: 'scroll-step',
    description: '滚动步长',
    type: 'number',
    default: '',
  },
  {
    name: 'validate-active',
    description: '有效选中',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'active-bar-size',
    description: '选中条宽度',
    type: 'number',
    default: '',
  },
  {
    name: 'active-bar-color',
    description: '选中条颜色',
    type: 'string',
    default: '#3a84ff',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'add',
    description: '添加选项卡事件',
    params: [
      {
        name: 'e',
        type: 'MouseEvent',
      },
    ],
  },
  {
    name: 'change',
    description: '切换选项卡选中事件',
    params: [
      {
        name: 'name',
        type: 'string',
      },
    ],
  },
  {
    name: 'remove',
    description: '移除选项卡事件',
    params: [
      {
        name: 'index',
        type: 'number',
      },
      {
        name: 'panel',
        type: 'ITabPanelProps',
        link: '/component/tab/api#ITabPanelProps',
      },
    ],
  },
  {
    name: 'sort',
    description: '排序事件',
    params: [
      {
        name: 'dragTabIndex',
        type: 'number',
      },
      {
        name: 'dropTabIndex',
        type: 'number',
      },
      {
        name: 'sortType',
        type: 'string',
      },
    ],
  },
  {
    name: 'drag',
    description: '拖拽事件',
    params: [
      {
        name: 'dragTabIndex',
        type: 'number',
      },
      {
        name: 'dragEvent',
        type: 'DragEvent',
      },
    ],
  },
];

const children = [
  {
    name: 'tab-panel',
    props: [
      {
        name: 'name',
        type: 'string | number',
        description: 'Panel 标记',
      },
      {
        name: 'label',
        type: 'string | function',
        description: 'Panel 渲染内容',
      },
      {
        name: 'tips',
        type: 'string',
        description: '选项卡提示',
      },
      {
        name: 'closable',
        type: 'boolean',
        description: '选项卡关闭',
      },
      {
        name: 'visible',
        type: 'boolean',
        description: '选项卡可见',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: '选项卡禁用',
      },
      {
        name: 'sortable',
        type: 'boolean',
        description: '选项卡排序',
      },
      {
        name: 'render-directive',
        type: 'string',
        description: 'Panel 渲染方式',
        options: ['show', 'if'],
        default: 'show',
      },
      {
        name: 'panel',
        type: 'string | function',
        description: 'Panel 渲染',
      },
      {
        name: 'num',
        type: 'number',
        description: '支持 panel 数字展示',
      },
      {
        name: 'numDisplayType',
        type: 'string',
        description: '通过numDisplayType设置数字样式，支持的属性有bracket(括号)、square(方形)、elliptic(椭圆)',
      },
    ],
  },
];

const slots = [
  {
    name: 'default',
    description: '默认插槽',
  },
];

// 组件分组
const group = NavGroupMeta.Nav;

// 组件名称
const name = 'tab';

// 组件标签
const title = 'Tab';

// 组件中文标签
const titleCN = '选项卡';

// 组件描述
const description = '选项卡切换组件。';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  presets,
  description,
  children,
  slots,
};

export default wiki;
