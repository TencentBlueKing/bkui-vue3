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
import CheckAnyLevelDemo from './check-any-level-demo.vue';
import IdKey from './id-key.vue';
import RemoteDemo from './remote-demo.vue';
import SeparatorDemo from './separator-demo.vue';

const cascaderPropsJson: IPropsTableItem[] = [
  {
    name: 'v-model',
    type: 'Array',
    default: '[]',
    desc: '当前被选中的值,多选时配置一个二维数组',
    optional: [],
  },
  {
    name: 'multiple',
    type: 'Boolean',
    default: false,
    desc: '是否多选',
    optional: [],
  },
  {
    name: 'list',
    type: 'Array',
    default: '[]',
    desc: '可选项数据源',
    optional: [],
  },
  {
    name: 'id-key',
    type: 'String',
    default: 'id',
    desc: '列表id指定的key值，默认为id,若需要改为其他key值，在这里传入即可',
    optional: [],
  },
  {
    name: 'name-key',
    type: 'String',
    default: 'id',
    desc: '列表name指定的key值，默认为name,若需要改为其他key值，在这里传入即可',
    optional: [],
  },
  {
    name: 'children-key',
    type: 'String',
    default: 'id',
    desc: '列表children子节点了列表指定的key值，默认为children,若需要改为其他key值，在这里传入即可',
    optional: [],
  },
  {
    name: 'trigger',
    type: 'String',
    default: 'click',
    desc: '触发方式',
    optional: ['click', 'hover'],
  },
  {
    name: 'check-any-level',
    type: 'Boolean',
    default: false,
    desc: '是否允许选择任意一级',
    optional: [],
  },
  {
    name: 'clearable',
    type: 'Boolean',
    default: true,
    desc: '是否允许选择任意一级',
    optional: [],
  },
  {
    name: 'placeholder',
    type: 'String',
    default: '请选择',
    desc: '未选择数据时的占位',
    optional: [],
  },
  {
    name: 'separator',
    type: 'String',
    default: '/',
    desc: '选项分隔符',
    optional: [],
  },
  {
    name: 'extCls',
    type: 'String',
    default: '',
    desc: '自定义样式',
    optional: [],
  },

];

const cascaderEventsJson: IPropsTableItem[] = [
  {
    name: 'change',
    type: 'String',
    default: null,
    desc: '内容改变时触发，回调为当前所选内容',
    optional: [],
  },
  {
    name: 'toggle',
    type: 'String',
    default: null,
    desc: '	切换下拉折叠状态时调用, 回调参数为当前是否展开',
    optional: ['true', 'false'],
  },
  {
    name: 'clear',
    type: 'String',
    default: null,
    desc: '清空选项时调用, 回调参数为请空前的内容',
    optional: [],
  },
];


export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          name='Cascader 级联组件'
          desc='Breadcrumb组件， 显示当前页面的路径，快速返回之前的任意页面。'
          link='https://www.google.com.hk/'/>

        <DemoBox
          title='基础用法'
          subtitle='基础数据展示'
          desc='通过trigger设置`click`或`hover`实现下一级的触发方式'
          componentName='cascader'
          demoName='base-demo'>
          <BaseDemo></BaseDemo>
        </DemoBox>

        <DemoBox
          title='任意级可选'
          subtitle='通过配置实现任意级可选'
          desc='设置`check-any-level`为true，可以将非叶子节点作为可选级'
          componentName='cascader'
          demoName='check-any-level-demo'>
          <CheckAnyLevelDemo></CheckAnyLevelDemo>
        </DemoBox>
        <DemoBox
          title='列表别名设置'
          subtitle='id-key name-key适配'
          desc='列表id指定的key值，默认为id,若需要改为其他key值，在这里传入即可,列表name指定的key值，默认为name,若需要改为其他key值，在这里传入即可'
          componentName='cascader'
          demoName='id-key'>
          <IdKey></IdKey>
        </DemoBox>
        <DemoBox
          title='分隔符'
          subtitle='自定义分隔符'
          desc='设置`separator`属性实现自定义分隔符'
          componentName='cascader'
          demoName='separator-demo'>
          <SeparatorDemo></SeparatorDemo>
        </DemoBox>

        <DemoBox
          title='远程加载'
          subtitle='远程加载list，异步加载'
          desc='可以通过`is-remote`开启动态加载，并通过`remote-method`来设置加载数据源的方法。注意远程拉取数据格式需要遵循list的要求'
          componentName='cascader'
          demoName='remote-demo'>
          <RemoteDemo></RemoteDemo>
        </DemoBox>

        <PropsBox
          title='Cascader Attributes'
          subtitle=''
          propsData={cascaderPropsJson}/>
        <PropsBox
          title='Cascader Events'
          subtitle=''
          propsData={cascaderEventsJson}/>
      </div>
    );
  },
});
