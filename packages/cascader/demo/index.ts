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
  {
    id: 'hunan',
    name: '湖南',
    disabled: true,
    children: [
      {
        id: 'changsha',
        name: '长沙',
      },
      {
        id: 'yueyang',
        name: '岳阳',
        disabled: true,
      },
    ],
  },
  {
    id: 'guangxi',
    name: '广西',
  },
  {
    id: 'yunnan',
    name: '云南',
    children: [
      {
        id: 'kunming',
        name: '昆明',
        children: [
          {
            id: 'wuhuaqu',
            name: '长文字测试五华山五华山五华山',
          },
          {
            id: 'guanduqu',
            name: '官渡区',
          },
          {
            id: 'xishanqu',
            name: '西山区',
          },
        ],
      },
      {
        id: 0,
        name: '大理',
      },
      {
        id: 'yuxi',
        name: '玉溪',
      },
    ],
  },
];

const style = `
  .bk-cascader-wrapper {
    width: 300px;
  }
`;

// 组件示例
const presets = [
  {
    title: '基础单选',
    description: '单选的级联选择器，选取后展示每一层级所选的内容。',
    props: {
      modelValue: [],
      // clearable: true,
      // filterable: true,
      // trigger: 'click',
      // checkAnyLevel: true,
      // showCompleteName: true,
      list,
    },
    style,
  },
  {
    title: '多选级联',
    description: '支持选择多个对象',
    props: {
      modelValue: [],
      // clearable: true,
      // filterable: true,
      // trigger: 'click',
      // checkAnyLevel: true,
      // showCompleteName: true,
      multiple: true,
      floatMode: true,
      // separator: '/',
      list,
    },
    style,
  },
  {
    title: '任意级可选',
    description: '通过配置实现任意级可选',
    props: {
      modelValue: [],
      trigger: 'click',
      checkAnyLevel: true,
      list,
    },
    style,
  },
  {
    title: '列表别名设置',
    description: 'id-key，name-key，children-key适配',
    props: {
      modelValue: [],
      idKey: 'uid',
      nameKey: 'title',
      childrenKey: 'subList',
      list: [
        {
          uid: 'hunan',
          title: '湖南',
          subList: [
            { uid: 'changsha', title: '长沙' },
            { uid: 'yueyang', title: '岳阳' },
          ],
        },
        {
          uid: 'guangdong',
          title: '广东',
          subList: [
            { uid: 'guangzhou', title: '广州' },
            { uid: 'shenzhen', title: '深圳' },
          ],
        },
        {
          uid: 'shanghai',
          title: '上海',
        },
      ],
    },
    style,
  },
  {
    title: '分隔符设置',
    description: '自定义分隔符',
    props: {
      modelValue: [],
      separator: '-',
      list,
    },
  },
  {
    title: '仅显示最后一级',
    description: '可在输入框仅显示最后一级的标签，而非完整路径',
    props: {
      modelValue: [],
      showCompleteName: false,
      list,
    },
    style,
  },
  {
    title: '自定义节点',
    description:
      '可以通过`scoped slot`对级联选择器的备选项的节点内容进行自定义，scoped slot传入node表示当前节点的 Node 的数据,data代表原数据',
    props: {
      modelValue: [],
      list,
    },
    slots: {
      default: `
        <div class="cascader-slots-demo-node">
          <i
            v-if="data.node.children.length"
            class="cascader-slots-demo-round"
          />
          <span>{{ data.node.name }} / {{ data.data.id }}</span>
          <span
            v-if="data.node.children.length"
            class="cascader-slots-demo-prepend"
            >{{ data.node.children.length }}</span
          >
        </div>
      `,
    },
    style,
  },
  {
    title: '远程加载',
    description:
      '可以通过`is-remote`开启动态加载，并通过`remote-method`来设置加载数据源的方法。注意远程拉取数据格式需要遵循list的要求',
    props: {
      modelValue: [],
      isRemote: true,
      list: [
        {
          id: 'hunan',
          name: '湖南',
        },
        {
          id: 'guangxi',
          name: '广西',
        },
        {
          id: 'yunnan',
          name: '云南',
        },
      ],
      remoteMethod: `(node, resolve) => {
        const { level } = node;
        let id = 0;
        setTimeout(() => {
          const nodes = Array.from({ length: level + 1 }).map(() => {
            id = id + 1;
            return {
              id,
              name: \`Option\${id}\`,
              leaf: level >= 2, // 为了更准确渲染，尽量通过\`leaf\`字段，告知是否是叶子节点；
            };
          });
          resolve(nodes);
        }, 1000);
      }`,
    },
    style,
  },
  {
    title: '自定义Trigger',
    description: '通过插槽自定义trigger',
    props: {
      modelValue: [],
      list,
    },
    slots: {
      trigger: `
        <div class="cascader-slots-demo-trigger">
          <span>selected: {{ data.selected }} {{ data.isShow }}</span>
        </div>
      `,
    },
    style,
  },
  {
    title: '自定义填充回调',
    description: '默认填充时，如果绑定数据不在列表中，会造成无法填充，此时可以通过自定义填充回调实现自定义填充',
    props: {
      modelValue: ['guangxi', 2, 3],
      list: [
        {
          id: 'hunan',
          name: '湖南',
        },
        {
          id: 'guangxi',
          name: '广西',
        },
        {
          id: 'yunnan',
          name: '云南',
        },
      ],
      customTextFillback: `
        (data, nodes) =>
          data
            .map(item => {
              const target = nodes.find(node => node.id === item);
              return target ? target.name : item;
            })
            .join('/')
      `,
    },
    style,
  },
  {
    title: '自定义面板',
    description: '通过插槽自定义面板内容',
    props: {
      modelValue: [],
      list,
    },
    slots: {
      panel: `
        <div class="cascader-slots-demo-panel">
          <span>Panel Level: {{ data.level }}, Nodes: {{ data.nodes.length }}</span>
        </div>
      `,
    },
    style,
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'modelValue',
    description: '选中值',
    type: 'Array<number | string | string[]>',
    default: [],
    isSupportVModel: true,
  },
  {
    name: 'list',
    description: '选项列表',
    type: 'Array<any>',
    default: [],
  },
  {
    name: 'placeholder',
    description: '未选择数据时的占位',
    type: 'string',
    default: '',
  },
  {
    name: 'behavior',
    description: '组件样式，simplicity为简约样式，默认为normal',
    type: 'string',
    options: ['normal', 'simplicity'],
    default: 'normal',
  },
  {
    name: 'filterable',
    description: '是否开启搜索',
    type: 'boolean',
    default: false,
  },
  {
    name: 'multiple',
    description: '是否多选',
    type: 'boolean',
    default: false,
  },
  {
    name: 'disabled',
    description: '是否禁用',
    type: 'boolean',
    default: false,
  },
  {
    name: 'clearable',
    description: '是否可清空',
    type: 'boolean',
    default: true,
  },
  {
    name: 'trigger',
    description: '触发方式',
    type: 'string',
    default: 'click',
    options: ['click', 'hover'],
  },
  {
    name: 'checkAnyLevel',
    description: '是否允许选择任意一级',
    type: 'boolean',
    default: false,
  },
  {
    name: 'isRemote',
    description: '是否远程加载',
    type: 'boolean',
    default: false,
  },
  {
    name: 'remoteMethod',
    description: '远程加载方法',
    type: 'function',
    default: '',
  },
  {
    name: 'showCompleteName',
    description: '输入框中是否显示选中值的完整路径',
    type: 'boolean',
    default: true,
  },
  {
    name: 'idKey',
    description: '列表id指定的key值，默认为id,若需要改为其他key值，在这里传入即可',
    type: 'string',
    default: 'id',
  },
  {
    name: 'nameKey',
    description: '列表name指定的key值，默认为name,若需要改为其他key值，在这里传入即可',
    type: 'string',
    default: 'name',
  },
  {
    name: 'childrenKey',
    description: '列表children指定的key值，默认为children,若需要改为其他key值，在这里传入即可',
    type: 'string',
    default: 'children',
  },
  {
    name: 'separator',
    description: '选项分隔符',
    type: 'string',
    default: '/',
  },
  {
    name: 'limitOneLine',
    description: '行内显示，当为ture时，选择的内容将会以Text的形式显示在一行',
    type: 'boolean',
    default: false,
  },
  {
    name: 'popoverOptions',
    description: 'popover属性',
    type: 'Partial<PopoverProps>',
    link: '/component/popover/api#IPopoverProps',
    default: {},
  },
  {
    name: 'extCls',
    description: '自定义样式',
    type: 'string',
    default: '',
  },
  {
    name: 'filterMethod',
    description: '搜索过滤方法',
    type: 'function',
    default: '',
  },
  {
    name: 'scrollHeight',
    description: '滚动高度',
    type: 'number | string',
    default: 216,
  },
  {
    name: 'scrollWidth',
    description: '滚动宽度',
    type: 'number | string',
    default: 'auto',
  },
  {
    name: 'customTextFillback',
    description: '自定义 text 填充回调, 参数为{modelValue, nodes}返回自定义填充后的文本, 返回值必须为 string',
    type: 'function',
    default: '',
  },
  {
    name: 'customTagsFillback',
    description:
      '自定义多选时 tags 填充回调, 参数为{modelValue, nodes}返回自定义填充后的tag数据, 返回值必须为数组 string[]',
    type: 'function',
    default: '',
  },
  {
    name: 'changeEmitsNodes',
    description: 'change事件是否返回节点数据',
    type: 'boolean',
    default: false,
  },
  {
    name: 'collapseTags',
    description: '多选是否折叠面板',
    type: 'boolean',
    default: true,
  },
  {
    name: 'floatMode',
    description: '多选开启漂浮模式，开启漂浮模式展开选择框不会挤占下方空间',
    type: 'boolean',
    default: false,
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'update:modelValue',
    description: '选中值更新时触发',
    params: [
      {
        name: 'publicVModelValue',
        type: 'Array<number | string | string[]>',
      },
    ],
  },
  {
    name: 'change',
    description: '选中值变化时触发',
    params: [
      {
        name: 'publicVModelValue',
        type: 'Array<number | string | string[]>',
      },
      {
        name: 'type',
        type: 'string',
      },
    ],
  },
  {
    name: 'clear',
    description: '清空选中值时触发',
    params: [],
  },
  {
    name: 'toggle',
    description: '展开/收起面板时触发',
    params: [
      {
        name: 'isOpen',
        type: 'boolean',
      },
    ],
  },
  {
    name: 'focus',
    description: '获取焦点时触发',
    params: [],
  },
];

// 组件插槽，用来自动生成插槽文档
const slots = [
  {
    name: 'default',
    description: '自定义级联选择器节点的内容',
    params: [
      {
        name: 'node',
        type: 'INode',
        description: '当前节点对象',
        link: '/component/cascader/api#INode',
      },
      {
        name: 'data',
        type: 'any',
        description: '当前节点的原始数据',
      },
    ],
  },
  {
    name: 'trigger',
    description: '自定义触发器，用于替换默认的选择框',
    params: [
      {
        name: 'selected',
        type: 'Array<number | string | string[]>',
        description: '当前选中的值',
      },
      {
        name: 'isShow',
        type: 'boolean',
        description: '面板是否显示',
      },
    ],
  },
  {
    name: 'extension',
    description: '自定义扩展内容，显示在级联面板的底部',
    params: [],
  },
  {
    name: 'panel',
    description: '自定义级联面板内容',
    params: [
      {
        name: 'nodes',
        type: 'Array<INode>',
        description: '当前面板节点列表',
        link: '/component/cascader/api#INode',
      },
      {
        name: 'level',
        type: 'number',
        description: '当前面板层级',
      },
      {
        name: 'activePath',
        type: 'Array<INode>',
        description: '当前活动路径',
        link: '/component/cascader/api#INode',
      },
    ],
  },
];

const types = [
  {
    name: 'INode',
    description: '级联选择器节点对象',
    fields: [
      {
        name: 'checked',
        type: 'boolean',
        description: '节点是否选中',
      },
      {
        name: 'children',
        type: 'null | null[]',
        description: '子节点列表',
      },
      {
        name: 'config',
        type: 'IConfig',
        description: '节点配置对象',
        link: '/component/cascader/api#IConfig',
      },
      {
        name: 'data',
        type: 'IData',
        description: '节点原始数据',
        link: '/component/cascader/api#IData',
      },
      {
        name: 'leaf',
        type: 'boolean',
        description: '是否为叶子节点',
      },
      {
        name: 'id',
        type: 'string',
        description: '节点ID',
      },
      {
        name: 'level',
        type: 'number',
        description: '节点层级',
      },
      {
        name: 'loading',
        type: 'boolean',
        description: '节点是否正在加载',
      },
      {
        name: 'loaded',
        type: 'boolean',
        description: '节点是否已加载',
      },
      {
        name: 'name',
        type: 'string',
        description: '节点名称',
      },
      {
        name: 'parent',
        type: 'INode',
        description: '父节点对象',
        link: '/component/cascader/api#INode',
      },
      {
        name: 'isDisabled',
        type: 'boolean',
        description: '节点是否禁用',
      },
      {
        name: 'isIndeterminate',
        type: 'boolean',
        description: '节点是否处于半选状态',
      },
      {
        name: 'isLeaf',
        type: 'boolean',
        description: '节点是否为叶子节点',
      },
      {
        name: 'pathNames',
        type: 'string[]',
        description: '节点路径名称数组',
      },
      {
        name: 'path',
        type: 'string[]',
        description: '节点路径ID数组',
      },
      {
        name: 'setNodeCheck',
        type: '(status: boolean) => void',
        description: '设置节点选中状态的方法',
      },
      {
        name: 'broadcast',
        type: '(event: string, check: boolean) => void',
        description: '广播事件的方法',
      },
      {
        name: 'emit',
        type: '(event: string) => void',
        description: '触发事件的方法',
      },
    ],
  },
  {
    name: 'IData',
    description: '级联选择器节点原始数据对象',
    fields: [
      {
        name: 'id',
        type: 'string',
        description: '节点ID',
      },
      {
        name: 'name',
        type: 'string',
        description: '节点名称',
      },
      {
        name: 'leaf',
        type: 'boolean',
        description: '是否为叶子节点（可选）',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: '是否禁用（可选）',
      },
      {
        name: 'children',
        type: 'IData[]',
        description: '子节点数据数组（可选）',
        link: '/component/cascader/api#IData',
      },
    ],
  },
  {
    name: 'IConfig',
    description: '级联选择器配置对象',
    fields: [
      {
        name: 'checkAnyLevel',
        type: 'boolean',
        description: '是否允许选择任意一级',
      },
      {
        name: 'childrenKey',
        type: 'string',
        description: '子节点的键名',
      },
      {
        name: 'clearable',
        type: 'boolean',
        description: '是否可清空',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: '是否禁用',
      },
      {
        name: 'idKey',
        type: 'string',
        description: 'ID的键名',
      },
      {
        name: 'isRemote',
        type: 'boolean',
        description: '是否远程加载',
      },
      {
        name: 'multiple',
        type: 'boolean',
        description: '是否多选',
      },
      {
        name: 'nameKey',
        type: 'string',
        description: '名称的键名',
      },
      {
        name: 'showCompleteName',
        type: 'boolean',
        description: '是否显示完整路径名称',
      },
      {
        name: 'trigger',
        type: 'string',
        description: '触发方式（click/hover）',
      },
      {
        name: 'separator',
        type: 'string',
        description: '路径分隔符',
      },
      {
        name: 'remoteMethod',
        type: 'Function',
        description: '远程加载方法',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Form;

// 组件名称
const name = 'cascader';

// 组件标签
const title = 'Cascader';

// 组件中文标签
const titleCN = '级联选择器';

// 组件描述
const description = '级联选择器';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  slots,
  types,
  presets,
  description,
};

export default wiki;
