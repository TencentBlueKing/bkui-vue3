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

import CardDemo from './card-demo.vue';
import CardEdit from './card-edit.vue';
const menuPropsJson: IPropsTableItem[] = [
  {
    name: 'title',
    type: 'String',
    default: '',
    desc: '卡片标题',
    optional: [],
  },
  {
    name: 'is-collapse',
    type: 'Boolean',
    default: 'false',
    desc: '是否支持展开&收起 ',
    optional: ['true', 'false'],
  },
  {
    name: 'collapse-status',
    type: 'Boolean',
    default: 'true',
    desc: '	展开 & 收起状态',
    optional: ['true', 'false'],
  },
  {
    name: 'position',
    type: 'String',
    default: 'left',
    desc: '展开icon的显示位置',
    optional: ['left', 'right'],
  },
  {
    name: 'show-head',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示头部',
    optional: ['true', 'false'],
  },
  {
    name: 'show-foot',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示底部',
    optional: ['true', 'false'],
  },
  {
    name: 'is-edit',
    type: 'Boolean',
    default: 'false',
    desc: '是否启用编辑标题功能',
    optional: ['true', 'false'],
  },
  {
    name: 'border',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示边框',
    optional: ['true', 'false'],
  },
  {
    name: 'disable-header-style',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用Header的line-height默认样式',
    optional: ['true', 'false'],
  },

];

export default defineComponent({
  setup() {
    return {
    };
  },
  render() {
    return (
      <div>
        <DemoTitle
          name="Card"
          desc="Card 卡片是一种容器，可以将信息聚合展示。"
          designLink="https://bkdesign.bk.tencent.com/design/38"/>
        <DemoBox
          title="基础用法"
          subtitle=""
          desc="通过配置footer插槽，自定义 Card 中底部内容 的展示。同理使用header插槽， 可自定义 Card 中顶部内容展示"
          componentName="card"
          demoName="card-demo">
          <CardDemo />
        </DemoBox>
        <DemoBox
          title="编辑标题"
          subtitle=""
          desc="通过配置isEdit属性为true即可开启标题功能，enter或失焦保存"
          componentName="card"
          demoName="card-edit">
          <CardEdit />
        </DemoBox>
        <PropsBox propsData={menuPropsJson}/>
      </div>
    );
  },
});
