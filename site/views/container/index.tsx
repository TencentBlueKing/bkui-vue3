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
import { type IPropsTableItem } from '../../typings';

import AllDemo from './demo/all.vue';
import BaseDemo from './demo/base.vue';
import CustomColDemo from './demo/custom-col.vue';
import CustomGutterDemo from './demo/custom-gutter.vue';
import CustomPushPullDemo from './demo/custom-push-pull.vue';
import FlexDemo from './demo/flex.vue';

const containerProps: IPropsTableItem[] = [
  {
    name: 'col',
    type: 'Number',
    default: 24,
    desc: '栅格数',
    optional: [],
  },
  {
    name: 'gutter',
    type: 'Number',
    default: 20,
    desc: '栅格之间的间距',
    optional: [],
  },
  {
    name: 'margin',
    type: 'Number',
    default: 20,
    desc: '栅格容器的左右外边距',
    optional: [],
  },
  {
    name: 'flex',
    type: 'Boolean',
    default: 'false',
    desc: '是否启用 flex 布局',
    optional: ['true', 'false'],
  },
  {
    name: 'ext-cls',
    type: 'String',
    default: '--',
    desc: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-grid-container 上',
    optional: [],
  },
];
const colProps: IPropsTableItem[] = [
  {
    name: 'span',
    type: 'Number',
    default: '1',
    desc: '栅格的占位格数，当设置为 0 时，则自动设置为 col 相当于 width: 100%',
    optional: [],
  },
  {
    name: 'offset',
    type: 'Number',
    default: '0',
    desc: '栅格的偏移',
    optional: [],
  },
  {
    name: 'pull',
    type: 'Number',
    default: '0',
    desc: '栅格向左移动格数',
    optional: [],
  },
  {
    name: 'push',
    type: 'Number',
    default: '0',
    desc: '栅格向右移动格数',
    optional: [],
  },
];
export default defineComponent({
  name: 'Affix',

  render() {
    return (
      <div>
        <DemoTitle
          name='Grid 栅格'
          desc='通过栅格系统，迅速简便地创建布局。'
          link={`${import.meta.env.VITE_APP_BASE_URL ?? ''}/grid`}
          designLink='https://bkdesign.bk.tencent.com/design/3'
        />
        <DemoBox
          title='基础布局'
          desc='创建基础的栅格布局。默认采用 24 栅格系统，将区域进行 24 等分。'
          componentName='container'
          demoName='demo/base'
        >
          <BaseDemo />
        </DemoBox>
        <DemoBox
          title='自定义设置栅格数以及整个栅格容器的左右边距'
          desc='通过 bk-container 的 col 属性来设置栅格数，这里设置成 12，将区域进行 12 等分，通过 bk-container 的 margin 属性来整个栅格容器的左右边距。'
          componentName='container'
          demoName='demo/custom-col'
        >
          <CustomColDemo />
        </DemoBox>
        <DemoBox
          title='自定义设置栅格之间的边距以及每个栅格的占位数'
          desc='通过 bk-container 的 gutter 属性来设置栅格之间的间隔，通过 bk-col 的 span 属性来设置栅格的占位数。'
          componentName='container'
          demoName='demo/custom-gutter'
        >
          <CustomGutterDemo />
        </DemoBox>
        <DemoBox
          title='自定义设置栅格的顺序以及栅格的偏移'
          desc='通过 bk-col 的 push 和 pull 属性来设置栅格的顺序。通过 bk-col 的 offset 属性设置栅格的偏移。'
          componentName='container'
          demoName='demo/custom-push-pull'
        >
          <CustomPushPullDemo />
        </DemoBox>
        <DemoBox
          title='flex 布局'
          desc='通过 bk-container 的 flex 属性来开启 flex 布局，配合 bk-col, bk-row 的嵌套使用来实现更复杂的布局。'
          componentName='container'
          demoName='demo/flex'
        >
          <FlexDemo />
        </DemoBox>
        <DemoBox
          title='栅格布局集合'
          desc='栅格布局集合。'
          componentName='container'
          demoName='demo/all'
        >
          <AllDemo />
        </DemoBox>
        <PropsBox
          title='bk-container 属性'
          subtitle=''
          propsData={containerProps}
        />
        <PropsBox
          title='bk-col 属性'
          subtitle=''
          propsData={colProps}
        />
      </div>
    );
  },
});
