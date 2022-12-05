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

const animateNumberPropsJson: IPropsTableItem[] = [
  {
    name: 'value',
    type: 'Number',
    default: '0',
    desc: '数字',
    optional: [],
  },
  {
    name: 'digits',
    type: 'Number',
    default: '0',
    desc: '小数位',
    optional: [],
  },
];

export default defineComponent({
  setup() {

  },
  render() {
    return (
      <div>
        <DemoTitle
          name="AnimateNumber 动态数字"
          desc="动态数字组件"
        />

        <DemoBox
          title="基础用法"
          subtitle=""
          desc="通过 value 设置初始值, 通过 digits 设置小数位。"
          componentName="animate-number"
          demoName="base-demo"
        >
          <BaseDemo></BaseDemo>
        </DemoBox>

        <PropsBox
          title="AnimateNumber 属性"
          subtitle=""
          propsData={animateNumberPropsJson}
        />
      </div>
    );
  },
});
