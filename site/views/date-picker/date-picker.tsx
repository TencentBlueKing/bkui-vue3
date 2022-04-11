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
import DemoTitle from '../../components/demo-title';
import DemoBox from '../../components/demo-box';
import PropsBox from '../../components/props-box';
import { IPropsTableItem } from '../../typings';
import BaseDemo from './base-demo.vue';

const menuPropsJson: IPropsTableItem[] = [
  {
    name: 'activeKey',
    type: 'String',
    default: '',
    desc: '选中的menu的key',
    optional: [],
  },
  {
    name: 'OpenedKeys',
    type: 'Array',
    default: [],
    desc: '打开的submenu key值',
    optional: [],
  },
  {
    name: 'mode',
    type: 'String',
    default: 'vertical',
    desc: '展示方式',
    optional: ['vertical', 'horizontal'],
  },
  {
    name: 'uniqueOpen',
    type: 'Boolean',
    default: 'true',
    desc: '是否唯一展开一个submenu',
    optional: [],
  },
];
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle name="DatePicker 日期选择器" desc="日期选择器" />
          <DemoBox
            title="基础用法"
            subtitle="基础用法，用于表单内容的录入"
            desc="通过 v-model 或者 value 设置初始值"
            componentName="date-picker"
            demoName="base-demo">
              <BaseDemo />
          </DemoBox>
        <PropsBox propsData={menuPropsJson}/>
      </div>
    );
  },
});
