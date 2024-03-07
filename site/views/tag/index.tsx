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
import CheckDemo from './check-demo.vue';
import ClosableDemo from './closable-demo.vue';
import IconDemo from './icon-demo.vue';
import RadiusDemo from './radius-demo.vue';
import SizeDemo from './size-demo.vue';
import TypeDemo from './type-demo.vue';

const propsJson: IPropsTableItem[] = [
  {
    name: 'closable',
    type: 'Boolean',
    default: 'false',
    desc: '标签是否可以关闭',
    optional: ['true', 'false'],
  },
  {
    name: 'theme',
    type: 'String',
    default: '',
    desc: '主题',
    optional: ['success', 'info', 'warning', 'danger'],
  },
  {
    name: 'type',
    type: 'String',
    default: '',
    desc: '类型',
    optional: ['filled', 'stroke'],
  },
  {
    name: 'checkable',
    type: 'Boolean',
    default: 'false',
    desc: '是否点击选中',
    optional: ['true', 'false'],
  },
  {
    name: 'checked',
    type: 'Boolean',
    default: 'false',
    desc: '设置标签的选中状态，跟 checkable 配合使用',
    optional: ['true', 'false'],
  },
  {
    name: 'radius',
    type: 'String',
    default: '2px',
    desc: '标签圆角设置',
    optional: [],
  },
  {
    name: 'size',
    type: 'String',
    default: '',
    desc: '配置尺寸',
    optional: ['default', 'small'],
  },
];
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          name='Tag 标签'
          desc='用于标记事物的属性 & 维度和分类的小标签'
        />
        <DemoBox
          title='基础用法'
          desc='通过 theme 设置不同的主题， success / info / warning / danger. 也可通过 ext-cls 配置自定义样式类名'
          componentName='tag'
          demoName='base-demo'
        >
          <BaseDemo />
        </DemoBox>
        <DemoBox
          title='自定义圆角'
          desc='通过 radius 配置项可自定义圆角大小'
          componentName='tag'
          demoName='radius-demo'
        >
          <RadiusDemo />
        </DemoBox>
        <DemoBox
          title='可关闭标签'
          subtitle='点击关闭标签'
          desc='通过设置 closable 定义 Tag 是否可移除'
          componentName='tag'
          demoName='closable-demo'
        >
          <ClosableDemo />
        </DemoBox>
        <DemoBox
          title='不同样式'
          subtitle='基础样式，填充式，描边式'
          desc='通过 type 设置不同的样式，默认是基础样式，还提供填充式（filled），描边式（stroke）'
          componentName='tag'
          demoName='type-demo'
        >
          <TypeDemo />
        </DemoBox>
        <DemoBox
          title='不同尺寸'
          subtitle='有两种尺寸可选 default, small'
          desc='通过 size 设置不同的尺寸'
          componentName='tag'
          demoName='size-demo'
        >
          <SizeDemo />
        </DemoBox>
        <DemoBox
          title='可选择标签'
          subtitle='点击后即可选中, 再次点击取消'
          desc='配置 checkable 实现点击切换选中效果，checked 可设置标签的选中状态'
          componentName='tag'
          demoName='check-demo'
        >
          <CheckDemo />
        </DemoBox>
        <DemoBox
          title='带图标 Icon 标签'
          subtitle='可以添加 icon 的 Tag'
          desc='通过 icon 插槽给 Tag 添加 icon'
          componentName='tag'
          demoName='icon-demo'
        >
          <IconDemo />
        </DemoBox>
        <PropsBox
          propsData={propsJson}
          subtitle=''
        />
      </div>
    );
  },
});
