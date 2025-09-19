/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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

import { NavGroupMeta } from '@bkui-vue/shared';

// 组件示例
const presets = [
  {
    title: '基础用法',
    description: '通过 list 属性配置选择器的选项数据',
    props: {
      list: [
        { value: 'option1', label: '选项1' },
        { value: 'option2', label: '选项2' },
        { value: 'option3', label: '选项3' },
        { value: 'option4', label: '选项4' },
      ],
    },
  },
  {
    title: '多选模式',
    description: '通过设置 multiple 属性开启多选模式',
    props: {
      multiple: true,
      list: [
        { value: 'option1', label: '选项1' },
        { value: 'option2', label: '选项2' },
        { value: 'option3', label: '选项3' },
        { value: 'option4', label: '选项4' },
        { value: 'option5', label: '选项5' },
      ],
    },
  },
  {
    title: '可搜索',
    description: '通过设置 filterable 属性开启搜索功能',
    props: {
      filterable: true,
      list: [
        { value: 'apple', label: '苹果' },
        { value: 'banana', label: '香蕉' },
        { value: 'orange', label: '橙子' },
        { value: 'grape', label: '葡萄' },
        { value: 'watermelon', label: '西瓜' },
        { value: 'strawberry', label: '草莓' },
      ],
    },
  },
  {
    title: '远程搜索',
    description: '通过 remoteMethod 属性实现远程搜索',
    props: {
      filterable: true,
      'remote-method': 'async (query) => { return new Promise((resolve) => { setTimeout(() => { resolve([{ value: "remote1", label: "远程选项1" }, { value: "remote2", label: "远程选项2" }]); }, 500); }); }',
    },
  },
  {
    title: '分组选项',
    description: '通过 OptionGroup 组件实现选项分组',
    slots: {
      default: `
        <BkSelect>
          <BkOptionGroup label="水果">
            <BkOption value="apple" label="苹果" />
            <BkOption value="banana" label="香蕉" />
          </BkOptionGroup>
          <BkOptionGroup label="蔬菜">
            <BkOption value="carrot" label="胡萝卜" />
            <BkOption value="tomato" label="西红柿" />
          </BkOptionGroup>
        </BkSelect>
      `,
    },
  },
  {
    title: '标签模式',
    description: '通过 multipleMode 属性设置为标签模式',
    props: {
      multiple: true,
      'multiple-mode': 'tag',
      list: [
        { value: 'tag1', label: '标签1' },
        { value: 'tag2', label: '标签2' },
        { value: 'tag3', label: '标签3' },
        { value: 'tag4', label: '标签4' },
      ],
    },
  },
  {
    title: '折叠标签',
    description: '通过 collapseTags 属性实现标签折叠',
    props: {
      multiple: true,
      'multiple-mode': 'tag',
      'collapse-tags': true,
      list: [
        { value: 'tag1', label: '标签1' },
        { value: 'tag2', label: '标签2' },
        { value: 'tag3', label: '标签3' },
        { value: 'tag4', label: '标签4' },
        { value: 'tag5', label: '标签5' },
        { value: 'tag6', label: '标签6' },
      ],
    },
  },
  {
    title: '全选功能',
    description: '通过 showSelectAll 属性开启全选功能',
    props: {
      multiple: true,
      'show-select-all': true,
      list: [
        { value: 'option1', label: '选项1' },
        { value: 'option2', label: '选项2' },
        { value: 'option3', label: '选项3' },
        { value: 'option4', label: '选项4' },
        { value: 'option5', label: '选项5' },
      ],
    },
  },
  {
    title: '自定义创建',
    description: '通过 allowCreate 属性允许创建自定义选项',
    props: {
      filterable: true,
      'allow-create': true,
      list: [
        { value: 'option1', label: '选项1' },
        { value: 'option2', label: '选项2' },
      ],
    },
  },
  {
    title: '禁用状态',
    description: '通过 disabled 属性禁用选择器',
    props: {
      disabled: true,
      list: [
        { value: 'option1', label: '选项1' },
        { value: 'option2', label: '选项2' },
      ],
    },
  },
  {
    title: '加载状态',
    description: '通过 loading 属性显示加载状态',
    props: {
      loading: true,
      list: [
        { value: 'option1', label: '选项1' },
        { value: 'option2', label: '选项2' },
      ],
    },
  },
  {
    title: '不同尺寸',
    description: '通过 size 属性设置不同尺寸',
    props: {
      size: 'large',
      list: [
        { value: 'option1', label: '大尺寸选项1' },
        { value: 'option2', label: '大尺寸选项2' },
      ],
    },
  },
  {
    title: '自定义占位符',
    description: '通过 placeholder 属性自定义占位符',
    props: {
      placeholder: '请选择您喜欢的选项',
      list: [
        { value: 'option1', label: '选项1' },
        { value: 'option2', label: '选项2' },
      ],
    },
  },
  {
    title: '虚拟滚动',
    description: '通过 enableVirtualRender 属性开启虚拟滚动',
    props: {
      'enable-virtual-render': true,
      list: Array.from({ length: 1000 }, (_, index) => ({
        value: `option${index + 1}`,
        label: `选项${index + 1}`,
      })),
    },
  },
  {
    title: '拼音搜索',
    description: '通过 searchWithPinyin 属性开启拼音搜索',
    props: {
      filterable: true,
      'search-with-pinyin': true,
      list: [
        { value: 'beijing', label: '北京' },
        { value: 'shanghai', label: '上海' },
        { value: 'guangzhou', label: '广州' },
        { value: 'shenzhen', label: '深圳' },
      ],
    },
  },
];

// 组件属性
const props = [
  {
    name: 'modelValue',
    type: 'any',
    default: '-',
    description: '绑定值，支持 v-model',
  },
  {
    name: 'multiple',
    type: 'Boolean',
    default: 'false',
    description: '是否多选',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    description: '是否禁用',
  },
  {
    name: 'size',
    type: 'String',
    default: 'default',
    description: '尺寸，可选值：large、default、small',
  },
  {
    name: 'clearable',
    type: 'Boolean',
    default: 'true',
    description: '是否显示清空按钮',
  },
  {
    name: 'loading',
    type: 'Boolean',
    default: 'false',
    description: '是否显示加载状态',
  },
  {
    name: 'filterable',
    type: 'Boolean',
    default: 'false',
    description: '是否支持搜索',
  },
  {
    name: 'remoteMethod',
    type: 'Function',
    default: '-',
    description: '远程搜索方法',
  },
  {
    name: 'scrollHeight',
    type: 'Number',
    default: '204',
    description: '下拉列表的最大高度',
  },
  {
    name: 'minHeight',
    type: 'Number',
    default: '-',
    description: '下拉列表的最小高度',
  },
  {
    name: 'showAll',
    type: 'Boolean',
    default: 'false',
    description: '是否显示"全部"选项',
  },
  {
    name: 'allOptionText',
    type: 'String',
    default: '""',
    description: '全部选项的文本',
  },
  {
    name: 'allOptionId',
    type: 'Number | String',
    default: '-',
    description: '全部选项的ID',
  },
  {
    name: 'showSelectAll',
    type: 'Boolean',
    default: 'false',
    description: '是否显示全选功能',
  },
  {
    name: 'popoverMinWidth',
    type: 'Number',
    default: '0',
    description: '弹出层的最小宽度',
  },
  {
    name: 'showOnInit',
    type: 'Boolean',
    default: 'false',
    description: '是否默认显示弹出层',
  },
  {
    name: 'multipleMode',
    type: 'String',
    default: 'default',
    description: '多选展示方式，可选值：default、tag',
  },
  {
    name: 'tagTheme',
    type: 'String',
    default: '-',
    description: '标签主题',
  },
  {
    name: 'behavior',
    type: 'String',
    default: '-',
    description: '输入框模式',
  },
  {
    name: 'collapseTags',
    type: 'Boolean',
    default: 'false',
    description: '是否折叠标签',
  },
  {
    name: 'autoHeight',
    type: 'Boolean',
    default: 'true',
    description: '是否自动调整高度',
  },
  {
    name: 'noDataText',
    type: 'String',
    default: '-',
    description: '无数据时的文本',
  },
  {
    name: 'noMatchText',
    type: 'String',
    default: '-',
    description: '无匹配时的文本',
  },
  {
    name: 'loadingText',
    type: 'String',
    default: '-',
    description: '加载时的文本',
  },
  {
    name: 'placeholder',
    type: 'String',
    default: '-',
    description: '占位符文本',
  },
  {
    name: 'searchPlaceholder',
    type: 'String',
    default: '-',
    description: '搜索框占位符文本',
  },
  {
    name: 'selectAllText',
    type: 'String',
    default: '-',
    description: '全选按钮文本',
  },
  {
    name: 'scrollLoading',
    type: 'Boolean',
    default: 'false',
    description: '是否显示滚动加载',
  },
  {
    name: 'allowCreate',
    type: 'Boolean',
    default: 'false',
    description: '是否允许创建自定义选项',
  },
  {
    name: 'popoverOptions',
    type: 'Object',
    default: '-',
    description: '弹出层配置选项',
  },
  {
    name: 'customContent',
    type: 'Boolean',
    default: 'false',
    description: '是否自定义内容',
  },
  {
    name: 'list',
    type: 'Array',
    default: '[]',
    description: '选项数据列表',
  },
  {
    name: 'idKey',
    type: 'String',
    default: 'value',
    description: '选项的ID字段名',
  },
  {
    name: 'displayKey',
    type: 'String',
    default: 'label',
    description: '选项的显示字段名',
  },
  {
    name: 'withValidate',
    type: 'Boolean',
    default: 'true',
    description: '是否启用表单验证',
  },
  {
    name: 'showSelectedIcon',
    type: 'Boolean',
    default: 'true',
    description: '多选时是否显示选中图标',
  },
  {
    name: 'inputSearch',
    type: 'Boolean',
    default: 'false',
    description: '是否采用输入框搜索方式',
  },
  {
    name: 'enableVirtualRender',
    type: 'Boolean',
    default: 'false',
    description: '是否开启虚拟滚动',
  },
  {
    name: 'allowEmptyValues',
    type: 'Array',
    default: '[]',
    description: '允许的空值选项',
  },
  {
    name: 'autoFocus',
    type: 'Boolean',
    default: 'false',
    description: '是否自动聚焦',
  },
  {
    name: 'disableFocusBehavior',
    type: 'Boolean',
    default: 'false',
    description: '是否禁用自动聚焦行为',
  },
  {
    name: 'keepSearchValue',
    type: 'Boolean',
    default: 'false',
    description: '是否保留搜索值',
  },
  {
    name: 'prefix',
    type: 'String',
    default: '-',
    description: '前缀文本',
  },
  {
    name: 'selectedStyle',
    type: 'String',
    default: '-',
    description: '选中样式',
  },
  {
    name: 'filterOption',
    type: 'Function',
    default: '-',
    description: '过滤选项的方法',
  },
  {
    name: 'searchWithPinyin',
    type: 'Boolean',
    default: 'true',
    description: '是否支持拼音搜索',
  },
  {
    name: 'highlightKeyword',
    type: 'Boolean',
    default: 'false',
    description: '是否高亮搜索关键词',
  },
  {
    name: 'trigger',
    type: 'String',
    default: 'default',
    description: '触发方式，可选值：default、manual',
  },
  {
    name: 'disableScrollToSelectedOption',
    type: 'Boolean',
    default: 'false',
    description: '是否禁用滚动到选中选项',
  },
  {
    name: 'inputTooltipsOptions',
    type: 'Object',
    default: '{}',
    description: '输入框提示配置',
  },
];

// 组件事件
const emits = [
  {
    name: 'update:modelValue',
    description: '绑定值变化时触发',
    params: [
      {
        name: 'value',
        type: 'any',
        description: '新的绑定值',
      },
    ],
  },
  {
    name: 'change',
    description: '选择项变化时触发',
    params: [
      {
        name: 'value',
        type: 'any',
        description: '当前选中的值',
      },
      {
        name: 'option',
        type: 'Object',
        description: '当前选中的选项',
      },
    ],
  },
  {
    name: 'toggle',
    description: '下拉框显示/隐藏时触发',
    params: [
      {
        name: 'isOpen',
        type: 'Boolean',
        description: '是否打开',
      },
    ],
  },
  {
    name: 'clear',
    description: '清空选择时触发',
    params: [],
  },
  {
    name: 'scroll-end',
    description: '滚动到底部时触发',
    params: [],
  },
  {
    name: 'focus',
    description: '获得焦点时触发',
    params: [
      {
        name: 'event',
        type: 'FocusEvent',
        description: '焦点事件对象',
      },
    ],
  },
  {
    name: 'blur',
    description: '失去焦点时触发',
    params: [
      {
        name: 'event',
        type: 'FocusEvent',
        description: '焦点事件对象',
      },
    ],
  },
  {
    name: 'tag-remove',
    description: '移除标签时触发',
    params: [
      {
        name: 'tag',
        type: 'any',
        description: '被移除的标签',
      },
      {
        name: 'index',
        type: 'Number',
        description: '标签索引',
      },
    ],
  },
  {
    name: 'select',
    description: '选择选项时触发',
    params: [
      {
        name: 'option',
        type: 'Object',
        description: '选中的选项',
      },
      {
        name: 'index',
        type: 'Number',
        description: '选项索引',
      },
    ],
  },
  {
    name: 'deselect',
    description: '取消选择选项时触发',
    params: [
      {
        name: 'option',
        type: 'Object',
        description: '取消选中的选项',
      },
      {
        name: 'index',
        type: 'Number',
        description: '选项索引',
      },
    ],
  },
  {
    name: 'search-change',
    description: '搜索内容变化时触发',
    params: [
      {
        name: 'value',
        type: 'String',
        description: '搜索内容',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Form;

// 组件名称
const name = 'select';

// 组件标签
const title = 'Select';

// 组件中文标签
const titleCN = '选择器';

export default {
  presets,
  props,
  emits,
  group,
  name,
  title,
  titleCN,
};
