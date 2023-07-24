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

import Basic from './demo/basic.vue';
import DiffContext from './demo/diff-context.vue';
import Format from './demo/format.vue';
import Theme from './demo/theme.vue';
// 输入框属性列表
const codeDiffProps: IPropsTableItem[] = [
  {
    name: 'old-content',
    type: 'String',
    default: '',
    desc: '旧内容',
    optional: [],
  },
  {
    name: 'new-content',
    type: 'String',
    default: '',
    desc: '新内容',
    optional: [],
  },
  {
    name: 'diff-format',
    type: 'String',
    default: 'line-by-line',
    desc: '展示方式',
    optional: ['line-by-line', 'side-by-side'],
  },
  {
    name: 'diff-context',
    type: 'String',
    default: '',
    desc: '不同地方间隔多少行不隐藏	',
    optional: [],
  },
  {
    name: 'theme',
    type: 'String',
    default: 'light',
    desc: '主题风格	',
    optional: ['light', 'dark'],
  },
  {
    name: 'language',
    type: 'String',
    default: 'javascript',
    desc: '语法高亮',
    optional: ['css', 'java', 'javascript', 'json', 'scss', 'less', 'stylus', 'shell', 'bash', 'cpp', 'go', 'xml', 'python', 'typescript', 'sql', 'ruby', 'vim', 'php', 'perl', 'powershell', 'makefile'],
  },
  {
    name: 'hljs',
    type: 'Object',
    default: null,
    desc: 'highlight 对象',
    optional: [],
  },
];

const demos = [{
  // '基础输入框',
  title: '基本用法',
  desc: '配置对比内容 old-content 和 new-content',
  componentName: 'code-diff',
  demoName: 'demo/basic',
  DemoComponent: Basic,
}, {
  // '基础输入框',
  title: '展示方式配置',
  desc: '配置展示方式format',
  componentName: 'code-diff',
  demoName: 'demo/format',
  DemoComponent: Format,
}, {
  // '基础输入框',
  title: '暗黑主题配置',
  desc: '配置Theme',
  componentName: 'code-diff',
  demoName: 'demo/theme',
  DemoComponent: Theme,
}, {
  // '基础输入框',
  title: '不隐藏行数配置',
  desc: '配置diffContext',
  componentName: 'code-diff',
  demoName: 'demo/diff-context',
  DemoComponent: DiffContext,
}];


export default defineComponent({
  name: 'Input',

  render() {
    return (
      <div>
        <DemoTitle
          name="Diff 差异对比"
          desc="代码差异对比使用highlight.js做代码高亮，所以在使用该组件之前，请先安装highlight.js依赖"
          link={`${import.meta.env.VITE_APP_BASE_URL ?? ''}/code-diff`}
        />
          {
            demos.map(({ DemoComponent, ...demo }) => (
              <DemoBox {...demo}>
                  <DemoComponent />
              </DemoBox>
            ))
          }
        <PropsBox
          title="CodeDiff 属性"
          subtitle=""
          propsData={codeDiffProps}/>

      </div>
    );
  },
});
