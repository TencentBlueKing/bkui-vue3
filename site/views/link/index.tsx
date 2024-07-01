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
import DisabledDemo from './disable-demo.vue';
import IconDemo from './icon-demo.vue';

const linkPropsJson: IPropsTableItem[] = [
  {
    name: 'theme',
    type: 'String',
    default: 'default',
    desc: '链接的主题颜色',
    optional: ['danger', 'default', 'primary', 'success', 'warning'],
  },
  {
    name: 'href',
    type: 'String',
    default: '',
    desc: '链接的 URL 地址',
    optional: [],
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: false,
    desc: '是否禁用链接',
    optional: [],
  },
  {
    name: 'underline',
    type: 'Boolean',
    default: false,
    desc: '是否显示下划线',
    optional: [],
  },
  {
    name: 'target',
    type: 'String',
    default: '_self',
    desc: '链接的打开方式',
    optional: ['_self', '_blank', '_parent', '_top'],
  },
];

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          desc='Link 文字超链接'
          designLink='https://bkdesign.bk.tencent.com/design/143'
          name='Link 文字链接'
        />

        <DemoBox
          componentName='link'
          demoName='base-demo'
          desc='基础的文字链接用法'
          title='基础用法'
        >
          <BaseDemo></BaseDemo>
        </DemoBox>

        <DemoBox
          componentName='link'
          demoName='disable-demo'
          desc='文字链接不可用状态，添加underline实现下划线'
          title='禁用状态和下划线'
        >
          <DisabledDemo></DisabledDemo>
        </DemoBox>

        <DemoBox
          componentName='link'
          demoName='icon-demo'
          desc='在 slot 中直接设置图标'
          title='支持设置图标'
        >
          <IconDemo></IconDemo>
        </DemoBox>

        <PropsBox
          propsData={linkPropsJson}
          subtitle=''
          title='Link 属性'
        />
      </div>
    );
  },
});
