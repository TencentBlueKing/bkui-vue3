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

import { BkSelect } from '@bkui-vue/select';

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import { IPropsTableItem } from '../../typings';

import SelectAllowCreate from './select-allow-create.vue';
import SelectBaseDemo from './select-base-demo.vue';
import SelectGroupDemo from './select-group-demo.vue';
import SelectMultiDemo from './select-multi-demo.vue';
import SelectScrollLoadingDemo from './select-scrollloading-demo.vue';
import SelectSearchDemo from './select-search-demo.vue';
import SelectSlotDemo from './select-slot-demo.vue';
import SelectStyleDemo from './select-style-demo.vue';
import SelectTreeDemo from './select-tree-demo.vue';
import SelectVirtualRender from './select-virtual-render.vue';

;

const propsJson: IPropsTableItem[] = Object.keys(BkSelect.props).map(prop => ({
  name: prop,
  type: BkSelect.props[prop]._vueTypes_name,
  default: BkSelect.props[prop].default,
  desc: '',
  optional: [],
}));
// 输入框插槽
const selectSlots = [
  {
    name: 'prefix',
    type: 'Slot',
    default: null,
    desc: '前置插槽',
    optional: [],
  },
  {
    name: 'suffix',
    type: 'Slot',
    default: null,
    desc: '后置插槽',
    optional: [],
  },
  {
    name: 'trigger',
    type: 'Slot',
    default: null,
    desc: '选项插槽',
    optional: [],
  },
  {
    name: 'extension',
    type: 'Slot',
    default: null,
    desc: '下拉选项拓展插槽',
    optional: [],
  },
  {
    name: 'tag',
    type: 'Slot',
    default: null,
    desc: '标签插槽（multiple-mode=“tag” 生效）',
    optional: [],
  },
];
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle name="Select 下拉选框" desc="将动作或菜单折叠到下拉菜单中，支持单选和多选"/>
        <DemoBox
          title="基础用法"
          desc="基础单选"
          componentName="select"
          demoName="select-base-demo">
          <SelectBaseDemo/>
        </DemoBox>
        <DemoBox
          title="尺寸 & 风格"
          desc="large、default、 small 三种尺寸，normal、simplicity两种风格"
          componentName="select"
          demoName="select-style-demo">
          <SelectStyleDemo/>
        </DemoBox>
        <DemoBox
          title="多选"
          desc="支持tag形式的多选"
          componentName="select"
          demoName="select-multi-demo">
          <SelectMultiDemo/>
        </DemoBox>
        <DemoBox
          title="分组"
          desc=""
          componentName="select"
          demoName="select-group-demo">
          <SelectGroupDemo/>
        </DemoBox>
        <DemoBox
          title="搜索"
          desc="远程搜索和本地搜索，注意：动态Options时建议使用value作为key，防止出现option没有销毁问题"
          componentName="select"
          demoName="select-search-demo">
          <SelectSearchDemo/>
        </DemoBox>
        <DemoBox
          title="滚动加载"
          desc="滚动加载"
          componentName="select"
          demoName="select-scrollloading-demo">
          <SelectScrollLoadingDemo/>
        </DemoBox>
        <DemoBox
          title="自定义创建"
          desc="自定义创建选项"
          componentName="select"
          demoName="select-allow-create">
          <SelectAllowCreate/>
        </DemoBox>
        <DemoBox
          title="Tree Select"
          desc="Tree Select"
          componentName="select"
          demoName="select-tree-demo">
          <SelectTreeDemo/>
        </DemoBox>
        <DemoBox
          title="Virtual Select"
          desc="虚拟滚动只支持list模式数据源"
          componentName="select"
          demoName="select-virtual-render">
          <SelectVirtualRender/>
        </DemoBox>
        <DemoBox
          title="自定义slot"
          desc="自定义tag和trigger"
          componentName="select"
          demoName="select-slot-demo">
          <SelectSlotDemo/>
        </DemoBox>
        <PropsBox propsData={propsJson} subtitle=""/>
        <PropsBox
          title="Select 插槽"
          subtitle=""
          propsData={selectSlots}/>
      </div>
    );
  },
});
