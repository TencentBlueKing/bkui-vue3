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
import ModuleCombinaDemo from './module-combina-demo.vue';
const menuPropsJson: IPropsTableItem[] = [
  {
    name: 'showAutoQuery',
    type: 'boolean',
    default: 'false',
    desc: '是否展示自动/手动查询配置',
    optional: ['true', 'false'],
  },
  {
    name: 'showChartPanel',
    type: 'boolean',
    default: 'true',
    desc: '是否展示趋势图',
    optional: ['true', 'false'],
  },
  {
    name: 'showStatisticsPanel',
    type: 'boolean',
    default: 'true',
    desc: '是否展示字段统计',
    optional: ['true', 'false'],
  },
  {
    name: 'serviceConfig',
    type: 'Object',
    default: null,
    desc: '数据源配置',
    optional: [],
  },
];
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          desc='业务组件 Log Search， 由索引集选择、查询语句输入、过滤条件选择等多方检索条件组合而成，还包含了自动解析查询语句，切换自动查询或手动查询能力等。支持 Vue2/Vue3 版本 无差别使用'
          name='Log Search'
          npmLink='https://www.npmjs.com/package/@blueking/log-search'
        />
        <DemoBox
          componentName='blueking/log-search'
          demoName='base-demo'
          desc='配置数据源 serviceConfig 直接使用'
          subtitle='组件的基础用法'
          title='基础用法'
        >
          <BaseDemo />
        </DemoBox>

        <DemoBox
          componentName='blueking/log-search'
          demoName='module-combina-demo'
          desc=''
          showTools={false}
          subtitle='可对组件功能进行拼装与组合，自定义使用组合形态。'
          title='功能组合示例'
        >
          <ModuleCombinaDemo />
        </DemoBox>

        <PropsBox
          propsData={menuPropsJson}
          title='组件属性'
        />
      </div>
    );
  },
});
