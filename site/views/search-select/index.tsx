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

import { defineComponent } from 'vue';

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import { IPropsTableItem } from '../../typings';

import BaseDemo from './base-demo.vue';
import MenuDemo from './menu-demo.vue';
import PlaceholderDemo from './placeholder-demo.vue';
import RemoteDemo from './remote-demo.vue';
import ValidateDemo from './validate-demo.vue';
import ValueBehaviorDemo from './value-behavior.vue';
const propsJson: IPropsTableItem[] = [
  {
    name: 'data',
    type: 'Array',
    default: [],
    desc: '搜索选择数据',
    optional: [],
  },
  {
    name: 'model-value / v-model',
    type: 'Array',
    default: [],
    desc: '已选择的数据项',
    optional: [],
  },
  {
    name: 'max-height',
    type: 'Number',
    default: '120',
    desc: '最大高度',
    optional: [],
  },
  {
    name: 'conditions',
    type: 'Array',
    default: '[{ id: \'or\', name: \'或\' }, { id: \'and\', name: \'且\' }]',
    desc: '条件选择列表',
    optional: [],
  },
  {
    name: 'clearable',
    type: 'Boolean',
    default: 'true',
    desc: '是否可以清空',
    optional: [],
  },
  {
    name: 'get-menu-list',
    type: 'Function',
    default: '',
    desc: '自定义动态获取选择项列表方法',
    optional: [],
  },
  {
    name: 'validate-values',
    type: 'Function',
    default: '',
    desc: '自定义动态验证选择或者输入值 如果返回 校验失败的文本则代表校验失败',
    optional: [],
  },
  {
    name: 'value-split-code',
    type: 'String',
    default: '|',
    desc: '多选的值的链接符号',
    optional: [],
  },
  {
    name: 'uniqueSelect',
    type: 'Boolean',
    default: 'false',
    desc: '是否过滤掉已选择项',
    optional: [],
  },
  {
    name: 'value-behavior',
    type: 'String',
    default: 'all',
    desc: '配置纯文本是否可以生成value (all: 可以，need-key: 需要key值)',
    optional: ['all', 'need-key'],
  },
  {
    name: 'placeholder',
    type: 'String',
    default: '请选择',
    desc: 'placeholder',
    optional: [],
  },
];
const slotsJson = [
  {
    name: 'prepend',
    type: 'name slot',
    default: [],
    desc: '组件最左侧填充插槽',
    params: '--',
  },
  {
    name: 'append',
    type: 'name slot',
    default: [],
    desc: '组件最右侧填充插槽',
    params: '--',
  },
  {
    name: 'menu',
    type: 'scoped slot',
    default: [],
    desc: 'menu面板子项插槽',
    params: '{list, item, hoverId, multiple, getSearchNode}',
  },
];
const eventJson = [
  {
    name: 'update:modelValue',
    desc: '选择项发生变化时触发',
    params: '[{id, name, values}]',
  },
  {
    name: 'search',
    desc: '点击右侧search Icon 时触发',
    params: 'event',
  },
];
const dataJson = [
  {
    name: 'id',
    type: 'String',
    default: '--',
    desc: '搜索选择数据选项唯一key值（必须是全局唯一）',
  },
  {
    name: 'name',
    type: 'String',
    default: '--',
    desc: '展示字段',
  },
  {
    name: 'children',
    type: '{id, name}[]',
    default: '--',
    desc: '子列表',
  },
  {
    name: 'multiple',
    type: 'Boolean',
    default: '--',
    desc: '是否可多选 默认不可多选',
  },
  {
    name: 'async',
    type: 'Boolean',
    default: '--',
    desc: '是否远程获取子列表 需配合组件属性 getMenuList使用 (默认是true)',
  },
  {
    name: 'noValidate',
    type: 'Boolean',
    default: '--',
    desc: '是否校验 需配合组件属性 validateValues使用',
  },
  {
    name: 'placeholder',
    type: 'String',
    default: '--',
    desc: 'placeholder',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: '--',
    desc: '是否禁用',
  },
  {
    name: 'onlyRecommendChildren',
    type: 'Boolean',
    default: 'false',
    desc: '添加推荐选项字符时 是否只匹配children数据',
  },
];
const slotColumnMap = {
  name: '名称',
  desc: '说明',
  type: '类型',
  params: '参数',
};
const eventColumnMap = {
  name: '名称',
  desc: '说明',
  params: '参数',
};
const dataColumnMap = {
  name: '名称',
  type: '类型',
  desc: '说明',
  default: '默认值',
};
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          name="Search Select"
          desc="Search Select组件， 为页面和模块提供方便的搜索选择功能。"
          designLink="https://bkdesign.bk.tencent.com/design/70"/>
        <DemoBox
          title="基础用法"
          subtitle="基础使用"
          desc="基础用法"
          componentName="search-select"
          demoName="base-demo">
             <BaseDemo/>
          </DemoBox>
          <DemoBox
          title="远程加载子列表"
          subtitle="通过配置属性 geMenuList 方法 来做到异步获取menu列表 同时配合 data 内子项 async 属性来配置针对不同的选择项是否需要远程获取子列表"
          desc="远程加载子列表"
          componentName="search-select"
          demoName="remote-demo">
             <RemoteDemo/>
          </DemoBox>
          <DemoBox
          title="校验输入的选择项"
          subtitle="通过配置属性 validateValues 方法 来做到对选择的子项进行校验 validateValues 返回校验失败文案 返回true则代表校验成功"
          desc="同时配合子项配置 noValidate 来做到不同的选择项是否触发校验"
          componentName="search-select"
          demoName="validate-demo">
             <ValidateDemo/>
          </DemoBox>
          <DemoBox
          title="配置每个选项独立的placeholder"
          subtitle="通过配置子选项属性 placeholder 来做到针对每一个选项都有独自的placeholder"
          desc="独立的placeholder"
          componentName="search-select"
          demoName="placeholder-demo">
             <PlaceholderDemo/>
          </DemoBox>
          <DemoBox
          title="配置 menu 插槽来自定义 menu 面板"
          subtitle="通过配置子选项属性 placeholder 来做到针对每一个选项都有独自的placeholder"
          desc="menu 插槽"
          componentName="search-select"
          demoName="menu-demo">
             <MenuDemo/>
          </DemoBox>
          <DemoBox
          title="配置 valueBehevior 属性定义生成 value 交互行为"
          subtitle="改变配置 valueBehevior 值为 need-key  来做到存文本不可生成 value tag"
          desc="valueBehevior 行为"
          componentName="search-select"
          demoName="menu-demo">
             <ValueBehaviorDemo/>
          </DemoBox>
        <PropsBox propsData={propsJson}/>
        <PropsBox title='data数据字段配置' columnMap={dataColumnMap} propsData={dataJson}/>
        <PropsBox title='插槽' columnMap={slotColumnMap} propsData={slotsJson}/>
        <PropsBox title='事件' columnMap={eventColumnMap} propsData={eventJson}/>
      </div>
    );
  },
});
