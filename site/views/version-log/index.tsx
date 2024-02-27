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
import BaseDemo from './base-demo.vue';
import DynamicDemo from './dynamic-demo.vue';
import SlotDemo from './slot-demo.vue';
import { IPropsTableItem } from '../../typings';

const menuPropsJson: IPropsTableItem[] = [
  {
    name: 'show',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示版本日志',
    optional: ['Boolean'],
  },
  {
    name: 'list',
    type: 'Array',
    default: '[]',
    desc: '版本日志列表，默认格式为[{ title: "v1.0.0", date: "2021-01-01", detail: "### 新增 \n - 增加xxx功能" }, ...], 其中属性都支持自定义key名称',
    optional: ['Array'],
  },
  {
    name: 'title-key',
    type: 'String',
    default: 'title',
    desc: 'list属性传入数据中主标题对应key，默认值为title，在list数据中主标题的值需要保证唯一性',
    optional: ['String'],
  },
  {
    name: 'sub-title-key',
    type: 'String',
    default: 'date',
    desc: 'list属性传入数据中副标题对应key，默认值为date',
    optional: ['String'],
  },
  {
    name: 'detail-key',
    type: 'String',
    default: 'detail',
    desc: 'list属性传入数据中日志详情对应key，默认值为detail',
    optional: ['String'],
  },
  {
    name: 'detail',
    type: 'String',
    default: 'string',
    desc: '右侧版本详情区域展示的内容，需要为合法的markdown字符串',
    optional: ['String'],
  },
  {
    name: 'active',
    type: 'String',
    default: '',
    desc: '当前选中的版本，值可设置范围为list属性数据中的主标题',
    optional: ['String'],
  },
  {
    name: 'current',
    type: 'String',
    default: '',
    desc: '当前最新版本，值可设置范围为list属性数据中的主标题',
    optional: ['String'],
  },
  {
    name: 'loading',
    type: 'Boolean',
    default: 'false',
    desc: '右侧版本详情区域是否展示loading状态',
    optional: ['Boolean'],
  },
  {
    name: 'min-left-width',
    type: 'Number',
    default: 180,
    desc: '左侧版本列表区域最小宽度',
    optional: [],
  },
  {
    name: 'min-left-width',
    type: 'Number',
    default: 580,
    desc: '左侧版本列表区域最大宽度',
    optional: [],
  }
];

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          name='VersionLog 版本更新日志'
          desc='在需要展示应用版本更新日志的情况下使用，日志详情支持 markdown 格式。'/>
        <DemoBox
          title='基础用法'
          desc='通过传入 list 属性来设置版本日志，日志详情需要为合法的 markdown 字符串格式'
          componentName='version-log'
          demoName='base-demo'
        >
          <BaseDemo />
        </DemoBox>
        <DemoBox
          title='动态获取版本详情'
          desc='用于版本详情需要异步获取的场景，通过selected事件回调，动态调用接口加载详情信息后，更新传入的 detail 属性来展示最新的版本日志'
          componentName='version-log'
          demoName='dynamic-demo'
        >
          <DynamicDemo />
        </DemoBox>
        <DemoBox
          title='插槽'
          desc='左侧列表区域、右侧详情区域均支持传入 slot 属性，用于自定义展示内容'
          componentName='version-log'
          demoName='slot-demo'
        >
          <SlotDemo />
        </DemoBox>
        <PropsBox propsData={menuPropsJson} />
      </div>
    );
  },
});
