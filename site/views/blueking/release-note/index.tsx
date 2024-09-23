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

import DemoBox from '../../../components/demo-box';
import DemoTitle from '../../../components/demo-title';
import PropsBox from '../../../components/props-box';
import AsyncLoadingDemo from './async-loading-demo.vue';
import BaseDemo from './base-demo.vue';
import SlotDemo from './slot-demo.vue';

const propsJson = [
  {
    name: 'active',
    type: 'String',
    default: 'list属性传入值的第一个版本',
    desc: '当前查看选中版本',
    optional: [],
  },
  {
    name: 'current',
    type: 'String',
    default: 'list属性传入值的第一个版本',
    desc: '当前最新的版本',
    optional: [],
  },
  {
    name: 'detail',
    type: 'String',
    default: '',
    desc: '日志详情内容, 即markdown字符串',
    optional: [],
  },
  {
    name: 'detailKey',
    type: 'String',
    default: 'detail',
    desc: 'list属性传入数据中日志详情对应key',
    optional: [],
  },
  {
    name: 'list',
    type: '{ [key: string]: string }[]',
    default: '[]',
    desc: '版本列表',
    optional: [],
  },
  {
    name: 'loading',
    type: 'Boolean',
    default: 'false',
    desc: '版本详情区域loading',
    optional: [],
  },
  {
    name: 'maxLeftWidth',
    type: 'Number',
    default: '580',
    desc: '左侧版本列表区域拖动最大宽度',
    optional: [],
  },
  {
    name: 'minLeftWidth',
    type: 'Number',
    default: '180',
    desc: '左侧版本列表区域拖动最小宽度',
    optional: [],
  },
  {
    name: 'show',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示版本日志弹窗',
    optional: [],
  },
  {
    name: 'subTitleKey',
    type: 'String',
    default: 'date',
    desc: 'list属性传入数据中副标题对应key',
    optional: [],
  },
  {
    name: 'titleKey',
    type: 'String',
    default: 'title',
    desc: 'list属性传入数据中主标题对应key，在list数据中主标题的值需要保证唯一性',
    optional: [],
  },
  {
    name: 'currentVersionText',
    type: 'String',
    default: '当前版本/Current',
    desc: '当前版本文本，用于标识当前版本',
    optional: [],
  },
];

const slotsJson = [
  {
    name: 'list',
    desc: '左侧版本列表区域',
    params: '',
  },
  {
    name: 'detail',
    desc: '右侧日志详情区域',
    params: '',
  },
];

const eventColumnMap = {
  name: '名称',
  desc: '说明',
  params: '参数',
};

const eventJson = [
  {
    name: 'showChange',
    desc: '日志弹窗打开、关闭时触发',
    params: 'value: boolean',
  },
  {
    name: 'selected',
    desc: '左侧版本列表选中版本时触发',
    params: 'value: string',
  },
];

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          desc='业务组件 Release， 用于呈现产品版本更新明细的组件'
          name='ReleaseNote'
          npmLink='https://www.npmjs.com/package/@blueking/release-note'
        />
        <DemoBox
          componentName='blueking/release-note'
          demoName='base-demo'
          desc=''
          subtitle=''
          title='基础用法'
        >
          <BaseDemo />
        </DemoBox>
        <DemoBox
          componentName='blueking/release-note'
          demoName='async-loading-demo'
          desc=''
          subtitle=''
          title='动态加载日志详情'
        >
          <AsyncLoadingDemo />
        </DemoBox>
        <DemoBox
          componentName='blueking/release-note'
          demoName='slot-demo'
          desc=''
          subtitle=''
          title='插槽用法'
        >
          <SlotDemo />
        </DemoBox>
        <PropsBox
          propsData={propsJson}
          title='Props属性'
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={slotsJson}
          title='Slots属性'
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={eventJson}
          title='组件事件'
        />
      </div>
    );
  },
});
