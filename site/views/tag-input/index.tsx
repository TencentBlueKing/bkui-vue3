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
import ClearDemo from './clear-demo.vue';
import CreateDemo from './create-demo.vue';
import DisabledDemo from './disabled-demo.vue';
import ExampleDemo from './example-demo.vue';
import GroupDemo from './group-demo.vue';
import ListDisabledDemo from './list-disabled-demo.vue';
import MatchDemo from './match-demo.vue';
import MoreDemo from './more-demo.vue';
import PasteDemo from './paste-demo.vue';
import SingleDemo from './single-demo.vue';
import TooltipsDemo from './tooltips-demo.vue';
import TriggerDemo from './trigger-demo.vue';

const propsJson: IPropsTableItem[] = [
  {
    name: 'list',
    type: 'Array',
    default: '[]',
    desc: '下拉菜单所需的数据列表',
    optional: [],
  },
  {
    name: 'placeholder',
    type: 'String',
    default: '请输入并按 Enter 结束',
    desc: '空数据时显示的提示文案',
    optional: [],
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用组件	',
    optional: ['true', 'false'],
  },
  {
    name: 'allow-next-focus',
    type: 'Boolean',
    default: 'true',
    desc: '多选时，是否允许选中后继续展示下拉选项',
    optional: ['true', 'false'],
  },
  {
    name: 'save-key',
    type: 'String',
    default: 'id',
    desc: '循环 list 时，保存字段的 key 值',
    optional: [],
  },
  {
    name: 'display-key',
    type: 'String',
    default: 'name',
    desc: '循环 list 时，展示字段的 key 值',
    optional: [],
  },
  {
    name: 'search-key',
    type: 'String',
    default: 'name',
    desc: '输入时，搜索的 key 值',
    optional: [],
  },
  {
    name: 'tooltip-key',
    type: 'String',
    default: '',
    desc: '让选中的标签在鼠标移上去时显示提示文案',
    optional: [],
  },
  {
    name: 'has-delete-icon',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示标签删除按钮',
    optional: ['true', 'false'],
  },
  {
    name: 'clearable',
    type: 'Boolean',
    default: 'false',
    desc: '是否允许清空',
    optional: ['true', 'false'],
  },
  {
    name: 'allow-create',
    type: 'Boolean',
    default: 'false',
    desc: '是否允许自定义标签输入',
    optional: ['true', 'false'],
  },
  {
    name: 'max-data',
    type: 'Number',
    default: '-1',
    desc: '是否限制可选个数，-1为不限制',
    optional: [],
  },
  {
    name: 'max-result',
    type: 'Number',
    default: '10',
    desc: '下拉列表搜索结果显示个数，默认为 10',
    optional: [],
  },
  {
    name: 'use-group',
    type: 'Boolean',
    default: 'false',
    desc: '是否启用分组',
    optional: ['true', 'false'],
  },
  {
    name: 'allow-auto-match',
    type: 'Boolean',
    default: 'false',
    desc: '配置输入时失焦点后，如果完全匹配则自动选中，如果自定义则自动输入',
    optional: ['true', 'false'],
  },
  {
    name: 'content-width',
    type: 'Number',
    default: '190',
    desc: '自定义设置下拉弹框的宽度，单选会撑满因此失效',
    optional: [],
  },
  {
    name: 'content-max-height',
    type: 'Number',
    default: '300',
    desc: '自定义设置下拉弹框的长度',
    optional: [],
  },
  {
    name: 'separator',
    type: 'String',
    default: '',
    desc: '输入分隔符号，支持批量输入',
    optional: [],
  },
  {
    name: 'tpl',
    type: 'Function',
    default: '',
    desc: '自定义下拉列表模板',
    optional: [],
  },
  {
    name: 'tag-tpl',
    type: 'Function',
    default: '',
    desc: '自定义标签模板',
    optional: [],
  },
  {
    name: 'paste-fn',
    type: 'Function',
    default: '',
    desc: '批量粘贴处理文本返回格式',
    optional: [],
  },
  {
    name: 'left-space',
    type: 'Number',
    default: '0',
    desc: '文字与左边框距离',
    optional: [],
  },
  {
    name: 'trigger',
    type: 'String',
    default: 'search',
    desc: '搜索列表触发展示方式，默认是输入关键字搜索时展示，也可以获取焦点是展示（用在数据量少的时候）',
    optional: ['search', 'focus'],
  },
  {
    name: 'create-tag-validator',
    type: 'Function',
    default: '',
    desc: '自定义标签校验函数，返回 boolean，参数(tag)，tag表示当前输入值，在自定义标签时，可以自定义添加标签的校验',
    optional: [],
  },
  {
    name: 'filter-callback',
    type: 'Function',
    default: '',
    desc: '过滤函数，参数 (filterVal, filterKey, data)，分别表示当前过滤的文本、当前数据使用的 key、所有数据，方便使用者根据自己的逻辑来筛选数据',
    optional: [],
  },
  {
    name: 'show-clear-only-hover',
    type: 'Boolean',
    default: '',
    desc: '是否在只有 hover 的时候才显示 clear 清除按钮',
    optional: [],
  },
  {
    name: 'collapse-tags',
    type: 'Boolean',
    default: 'false',
    desc: '失焦是否折叠 tags',
    optional: ['true', 'false'],
  },
];
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle name="TagInput 标签输入框" desc="常用于对标签列表的填写、关键字的输入" />
        <DemoBox
          title="基础用法"
          desc="通过 bk-tag-input 来使用组件，其中 list 属性为下拉选择列表选项"
          componentName="tag-input"
          demoName="base-demo">
            <BaseDemo />
        </DemoBox>
        <DemoBox
          title="触发方式"
          desc="配置 trigger 来设置下拉框的显示方式，有 focus（获焦点时显示）, search（搜索时显示）两种"
          componentName="tag-input"
          demoName="trigger-demo">
            <TriggerDemo />
        </DemoBox>
        <DemoBox
          title="hover 时才显示 clear 按钮"
          desc="设置 show-clear-only-hover 为 true，则其 clear 按钮在 hover 时才会显示"
          componentName="tag-input"
          demoName="clear-demo">
            <ClearDemo />
        </DemoBox>
        <DemoBox
          title="自定义标签"
          desc="设置 allow-create 属性来输入自定义标签，按 Enter 键结束；设置 has-delete-icon 属性可显示标签删除按钮"
          componentName="tag-input"
          demoName="create-demo">
            <CreateDemo />
        </DemoBox>
        <DemoBox
          title="失去焦点自动匹配"
          desc="设置 allow-auto-match 属性当输入内容时失去焦点后，如果完全匹配则自动选中，如果设置 allow-create 属性则创建标签"
          componentName="tag-input"
          demoName="match-demo">
            <MatchDemo />
        </DemoBox>
        <DemoBox
          title="更多自定义配置"
          desc="设置 save-key 属性定义选项的保存 key 值；设置 display-key 属性定义选项展示名称；search-key 属性定义多字段索引；tpl 属性可自定义下拉列表展示"
          componentName="tag-input"
          demoName="more-demo">
            <MoreDemo />
        </DemoBox>
        <DemoBox
          title="分组展示"
          desc="配置 use-group 来启用分组功能， 数据源必须加上 children 的配置"
          componentName="tag-input"
          demoName="group-demo">
            <GroupDemo />
        </DemoBox>
        <DemoBox
          title="设置选中标签 tooltips"
          desc="配置 tooltip-key 定义选中标签 hover 时的显示文案"
          componentName="tag-input"
          demoName="tooltips-demo">
            <TooltipsDemo />
        </DemoBox>
        <DemoBox
          title="列表项禁用"
          desc="设置列表数据源 disabled 属性来禁用列表中的某些项，禁止用户选择"
          componentName="tag-input"
          demoName="list-disabled-demo">
            <ListDisabledDemo />
        </DemoBox>
        <DemoBox
          title="组件禁用状态"
          desc="设置 disabled 属性来禁用组件"
          componentName="tag-input"
          demoName="disabled-demo">
            <DisabledDemo />
        </DemoBox>
        <DemoBox
          title="批量输入"
          desc="粘贴内容默认按“;”来分割内容，设置 paste-fn 方法可以自定义粘贴输出内容"
          componentName="tag-input"
          demoName="paste-demo">
            <PasteDemo />
        </DemoBox>
        <DemoBox
          title="综合例子(多选)"
          desc="设置 tpl 方法自定义下拉列表展示；设置 tagTpl 方法自定义标签展示，通过 max-data 属性限制最大可选数量"
          componentName="tag-input"
          demoName="example-demo">
            <ExampleDemo />
        </DemoBox>
        <DemoBox
          title="综合例子(单选)"
          desc="设置 filter-callback 定义过滤方法；设置 create-tag-validator 定义创建标签校验方法"
          componentName="tag-input"
          demoName="single-demo">
            <SingleDemo />
        </DemoBox>
        <PropsBox propsData={propsJson} subtitle="" />
      </div>
    );
  },
});
