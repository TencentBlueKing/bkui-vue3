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

import { defineComponent } from 'vue';

import DemoBox from '../../../components/demo-box';
import DemoTitle from '../../../components/demo-title';
import PropsBox from '../../../components/props-box';
import { IPropsTableItem } from '../../../typings';
import BaseDemo from './base-demo.vue';
import DialogDemo from './dialog-demo.vue';
import PartialDemo from './partial-demo.vue';
const menuPropsJson: IPropsTableItem[] = [
  {
    name: 'mode',
    type: "'dialog' | 'page' | 'partial'",
    default: "'page'",
    desc: '展示模式',
    optional: ["'dialog'", "'page'", "'partial'"],
  },
  {
    name: 'showDialog',
    type: 'boolean',
    default: 'false',
    desc: '弹窗dialog模式时是否显示dialog，其他模式下无效',
    optional: ['true', 'false'],
  },
  {
    name: 'title',
    type: 'string',
    default: '',
    desc: '功能依赖标题',
    optional: [],
  },
  {
    name: 'functionalDesc',
    type: 'string',
    default: '',
    desc: '功能依赖描述',
    optional: [],
  },
  {
    name: 'guideTitle',
    type: 'string',
    default: '',
    desc: '功能指引标题',
    optional: [],
  },
  {
    name: 'guideDescList',
    type: 'string[]',
    default: '',
    desc: '功能指引描述列表',
    optional: [],
  },
];
const eventJson = [
  {
    name: 'update:showDialog',
    desc: '更新showDialog',
    params: 'value: boolean',
  },
  {
    name: 'gotoMore',
    desc: '点击了解更多',
    params: '',
  },
];
const eventColumnMap = {
  name: '名称',
  desc: '说明',
  params: '参数',
};

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          desc='业务组件 Functional Dependency， 用于蓝鲸平台下各个应用中功能依赖项展示使用，支持 Vue2/Vue3 版本 无差别使用'
          name='Functional Dependency'
          npmLink='https://www.npmjs.com/package/@blueking/functional-dependency'
        />
        <DemoBox
          componentName='blueking/functional-deps'
          demoName='base-demo'
          desc='配置 mode 为 page'
          subtitle='组件的 page 模式'
          title='默认展示'
        >
          <BaseDemo />
        </DemoBox>
        <DemoBox
          componentName='blueking/functional-deps'
          demoName='dialog-demo'
          desc='配置 mode 为 dialog'
          subtitle='组件的 dialog 弹窗模式'
          title='弹窗模式'
        >
          <DialogDemo />
        </DemoBox>
        <DemoBox
          componentName='blueking/functional-deps'
          demoName='partial-demo'
          desc='配置 mode 为 partial'
          subtitle='组件的 partial 局部展示模式'
          title='局部展示模式'
        >
          <PartialDemo />
        </DemoBox>
        <PropsBox
          propsData={menuPropsJson}
          title='组件属性'
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
