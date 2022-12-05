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
import {
  type IPropsTableItem,
} from '../../typings';

import DemoPagination from './demo/pagination.vue';
import DemoPaginationSmall from './demo/pagination-small.vue';

const paginationProps: IPropsTableItem[] = [
  {
    name: 'model-value / v-model',
    type: 'String',
    default: '当前页码',
    desc: '',
    optional: [],
  },
  {
    name: 'count',
    type: 'Number',
    default: '0',
    desc: '数据总数',
    optional: [],
  },
  {
    name: 'limit',
    type: 'Number',
    default: '',
    desc: '每页显示条数(须存在于limit-list中) ',
    optional: [],
  },
  {
    name: 'limit-list',
    type: 'String',
    default: '[10, 20, 50, 100]',
    desc: '每页显示条数可选项列表',
    optional: [],
  },
  {
    name: 'show-limit',
    type: 'Number',
    default: 'true',
    desc: '是否显示每页显示条数控件',
    optional: ['true', 'false'],
  },
  {
    name: 'type',
    type: 'String',
    default: '',
    desc: '组件外观类型',
    optional: ['default', 'compact'],
  },
  {
    name: 'align',
    type: 'String',
    default: 'left',
    desc: '分页控件位置，优先级高于location',
    optional: ['left', 'center', 'right'],
  },
  {
    name: 'location',
    type: 'String',
    default: 'right',
    desc: '每页显示条数控件位置',
    optional: ['left', 'right'],
  },
  {
    name: 'small',
    type: 'Boolean',
    default: 'false',
    desc: '小型分页',
    optional: ['true', 'false'],
  },
  {
    name: 'show-total-count',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示总计',
    optional: ['true', 'false'],
  },
  {
    name: 'prev-text',
    type: 'String',
    default: '',
    desc: '上一页按钮文案',
    optional: [],
  },
  {
    name: 'next-text',
    type: 'String',
    default: '',
    desc: '下一页按钮文案',
    optional: [],
  },
];

const paginationEvents: IPropsTableItem[] = [
  {
    name: 'change',
    type: 'Function',
    default: '',
    desc: '当前页码变化时的回调',
    optional: [],
  },
  {
    name: 'limit-change',
    type: 'Function',
    default: '',
    desc: '当前分页尺寸变化时的回调',
    optional: [],
  },
];

export default defineComponent({
  name: 'Pagination',
  render() {
    return (
      <div>
        <DemoTitle
          name="Pagination"
          desc="数据分页"
          link="https://www.qq.com/"/>
        <DemoBox
          title="基本用法"
          desc=""
          componentName="pagination"
          demoName="/demo/pagination">
            <DemoPagination />
        </DemoBox>
        <DemoBox
          title="小型分页"
          desc=""
          componentName="pagination"
          demoName="/demo/pagination-small">
            <DemoPaginationSmall />
        </DemoBox>
        <PropsBox
          title="Pagination 属性"
          subtitle=""
          propsData={paginationProps}/>
        <PropsBox
          title="Pagination 事件"
          subtitle=""
          propsData={paginationEvents}/>
      </div>
    );
  },
});
