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
import CustomHeaderDemo from './custom-header-demo.vue';
import CustomOptionDemo from './custom-option-demo.vue';
import NormalListDemo from './normal-list-demo.vue';
import SearchDemo from './search-demo.vue';
import TargetListDemo from './target-list-demo.vue';

const transferPropsJson: IPropsTableItem[] = [
  {
    name: 'title',
    type: 'Array',
    default: ['左侧列表', '右侧列表'],
    desc: '顶部 title',
    optional: [],
  },
  {
    name: 'empty-content',
    type: 'Array',
    default: ['无数据', '未选择任何项'],
    desc: '无数据时显示文案',
    optional: [],
  },
  {
    name: 'display-key',
    type: 'String',
    default: 'name',
    desc: '循环 list 时，显示字段的 key 值',
    optional: [],
  },
  {
    name: 'setting-key',
    type: 'String',
    default: 'id',
    desc: '具有唯一标识的 key 值',
    optional: [],
  },
  {
    name: 'sort-key',
    type: 'Boolean',
    default: '',
    desc: '排序所依据的 key',
    optional: [],
  },
  {
    name: 'searchable',
    type: 'Boolean',
    default: 'false',
    desc: '是否允许左侧搜索（以display-key来匹配）',
    optional: [],
  },
  {
    name: 'sortable',
    type: 'Boolean',
    default: 'false',
    desc: '是否设置排序',
    optional: [],
  },
  {
    name: 'source-list',
    type: 'Array',
    default: '',
    desc: '穿梭框数据源(必传)',
    optional: [],
  },
  {
    name: 'target-list',
    type: 'Array',
    default: [],
    desc: '已选择的数据（唯一标识 setting-key 的数组），可以使用v-mode:targetList绑定',
    optional: [],
  },
  // {
  //   name: 'always-show-close',
  //   type: 'Boolean',
  //   default: 'true',
  //   desc: '是否一直显示关闭icon',
  //   optional: [],
  // },
  // {
  //   name: 'show-overflow-tips',
  //   type: 'Boolean',
  //   default: 'false',
  //   desc: '文本溢出时，是否使用气泡显示全部内容',
  //   optional: [],
  // },
  {
    name: 'ext-cls',
    type: 'String',
    default: '',
    desc: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-transfer 上',
    optional: [],
  },

];

const transferSlotsJson: IPropsTableItem[] = [
  {
    name: 'left-header',
    type: 'Function',
    default: '',
    desc: '左侧头部插槽',
    optional: [],
  },
  {
    name: 'right-header',
    type: 'Function',
    default: '',
    desc: '右侧头部插槽',
    optional: [],
  },
  {
    name: 'left-empty-content',
    type: 'Function',
    default: '',
    desc: '左侧无数据时插槽',
    optional: [],
  },
  {
    name: 'right-empty-content',
    type: 'Function',
    default: '',
    desc: '右侧无数据时插槽',
    optional: [],
  },
  {
    name: 'source-option',
    type: 'Function',
    default: '',
    desc: '左侧选项卡插槽',
    optional: [],
  },
  {
    name: 'target-option',
    type: 'Function',
    default: '',
    desc: '右侧选项卡插槽',
    optional: [],
  },
];

const transferChangeJson: IPropsTableItem[] = [
  {
    name: 'change',
    type: 'Function(sourceList, targetList, targetValueList)',
    default: '',
    desc: '右侧选择数据改变时触发(sourceList:未选择数据，targetList 表示所选数据；targetValueList表示唯一标识 setting-key 的数组)',
    optional: [],
  },
  {
    name: 'update:targetList',
    type: 'Function(targetList)',
    default: '',
    desc: '可使用v-mode:targetList绑定，也可以单独监听',
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
          name="Transfer 穿梭框"
          desc="通过双栏穿梭选择框，利用更大的空间展示更多可选项、已选项的信息。"
          link="https://www.google.com.hk/"
        />
        <DemoBox
          title="基础用法"
          subtitle=""
          desc="默认配置 source-list 和 display-key，source-list 为必传 source-list 可以是普通数组(普通数组会自动去重)。当 source-list 为普通数组时，display-key 可不传。"
          componentName="transfer"
          demoName="base-demo">
          <BaseDemo></BaseDemo>
        </DemoBox>
        <DemoBox
          title="配置 target-list 以及设置排序"
          subtitle=""
          desc="配置 sortable 以及 sort-key 使得操作数据时数据的排序不变，配置 target-list 设置默认选择的数据。sortable 为 true 时开启排序功能，为 false 时则关闭，sort-key 为排序所依据的 key 值。注意：当 source-list 为普通数组时，开启排序时默认按照值排序，此时不需要传 sort-key。"
          componentName="transfer"
          demoName="target-list-demo">
          <TargetListDemo></TargetListDemo>
        </DemoBox>
        <DemoBox
          title="普通数组配置"
          subtitle=""
          desc="此时根据值排序；display-key、sort-key、setting-key 不需要传。"
          componentName="transfer"
          demoName="normal-list-demo">
          <NormalListDemo></NormalListDemo>
        </DemoBox>
        <DemoBox
          title="自定义 header 和无数据时显示内容"
          subtitle=""
          desc="配置 slot 为 left-header 或 right-header 可自定义 header 内容，配置 slot 为 left-empty-content 和 right-empty-content 可自定义数据为空时所显示的内容(注意：当配置了 slot 时，其 title 和 empty-content 配置不会生效)"
          componentName="transfer"
          demoName="custom-header-demo">
          <CustomHeaderDemo></CustomHeaderDemo>
        </DemoBox>
        <DemoBox
          title="自定义 选项 模板"
          subtitle=""
          desc="配置 slot 为 source-option 或 target-option 可自定义 选项 内容。"
          componentName="transfer"
          demoName="custom-option-demo">
          <CustomOptionDemo></CustomOptionDemo>
        </DemoBox>
        <DemoBox
          title="左侧带搜索"
          subtitle=""
          desc="配置 searchable 启用搜索功能"
          componentName="transfer"
          demoName="search-demo">
          <SearchDemo></SearchDemo>
        </DemoBox>
        <PropsBox
          title="Transfer 属性"
          subtitle=""
          propsData={transferPropsJson}
        />
        <PropsBox
          title="Transfer 插槽"
          subtitle=""
          propsData={transferSlotsJson}
        />
        <PropsBox
          title="Transfer 事件"
          subtitle=""
          propsData={transferChangeJson}
        />
      </div>
    );
  },
});
