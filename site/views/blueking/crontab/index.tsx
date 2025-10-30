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
import BaseDemo from './demo/base.vue';
const menuPropsJson: IPropsTableItem[] = [
  {
    name: 'modelValue',
    type: 'string',
    default: '',
    desc: '表达式',
    optional: [],
  },
  {
    name: 'shortcuts',
    type: '{label: string; value: string}[]',
    default: '',
    desc: '快捷选项',
    optional: [],
  },
  {
    name: 'renderExtends',
    type: '() => VNode',
    default: '',
    desc: '自定义内容',
    optional: [],
  },
];
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          desc='Liunx 定时任务表达'
          name='Cronatb'
          npmLink='https://www.npmjs.com/package/@blueking/crontab'
        />
        <DemoBox
          componentName='blueking/crontab'
          demoName='demo/base'
          desc='modelValue 设置值'
          subtitle='组件的基础用法'
          title='基础用法'
        >
          <BaseDemo />
        </DemoBox>
        <PropsBox
          propsData={menuPropsJson}
          title='组件属性'
        />
      </div>
    );
  },
});
