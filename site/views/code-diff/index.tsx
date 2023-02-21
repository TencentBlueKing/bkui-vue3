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

import { defineAsyncComponent, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import i18n from '../../language/i18n';
import { type IPropsTableItem } from '../../typings';
import { getCookie } from '../utils/cookie';

const lang = getCookie('blueking_language');

const Basic = defineAsyncComponent(() => import(`./demo/${lang}/basic.vue`));
const DiffContext = defineAsyncComponent(() => import(`./demo/${lang}/diff-context.vue`));
const Format = defineAsyncComponent(() => import(`./demo/${lang}/format.vue`));
const Theme = defineAsyncComponent(() => import(`./demo/${lang}/theme.vue`));

const { t } = i18n.global;

interface IPropsDiffItem extends IPropsTableItem {
  title: string,
  componentName: string,
  demoName: string,
  DemoComponent: any,
}

// 输入框属性列表
const codeDiffProps: IPropsTableItem[] = [
  {
    name: 'oldContent',
    type: 'String',
    default: '',
    desc: '旧内容',
    optional: [],
  },
  {
    name: 'newContent',
    type: 'String',
    default: '',
    desc: '新内容',
    optional: [],
  },
  {
    name: 'diffFormat',
    type: 'String',
    default: 'line-by-line',
    desc: '展示方式',
    optional: ['line-by-line', 'side-by-side'],
  },
  {
    name: 'diffContext',
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
    optional: [
      'css',
      'java',
      'javascript',
      'json',
      'scss',
      'less',
      'stylus',
      'shell',
      'bash',
      'cpp',
      'go',
      'xml',
      'python',
      'typescript',
      'sql',
      'ruby',
      'vim',
      'php',
      'perl',
      'powershell',
      'makefile',
    ],
  },
  {
    name: 'hljs',
    type: 'Object',
    default: null,
    desc: 'highlight 对象',
    optional: [],
  },
].map((item: IPropsTableItem) => {
  const result = Object.assign(item, { desc: t(item.desc) });
  return {
    ...result,
  };
});

const demos = [
  {
    // '基础输入框',
    title: '基本用法',
    desc: '配置对比内容 old-content 和 new-content',
    componentName: 'code-diff',
    demoName: `demo/${lang}/basic`,
    DemoComponent: Basic,
  },
  {
    // '基础输入框',
    title: '展示方式配置',
    desc: '配置展示方式format',
    componentName: 'code-diff',
    demoName: `demo/${lang}/format`,
    DemoComponent: Format,
  },
  {
    // '基础输入框',
    title: '暗黑主题配置',
    desc: '配置Theme',
    componentName: 'code-diff',
    demoName: `demo/${lang}/theme`,
    DemoComponent: Theme,
  },
  {
    // '基础输入框',
    title: '不隐藏行数配置',
    desc: '配置diffContext',
    componentName: 'code-diff',
    demoName: `demo/${lang}/diff-context`,
    DemoComponent: DiffContext,
  },
].map((item: IPropsDiffItem) => {
  const result = Object.assign(item, { desc: t(item.desc), title: t(item.title) });
  return {
    ...result,
  };
});

export default defineComponent({
  name: 'Input',

  render() {
    const { t } = useI18n();
    return (
      <div>
        <DemoTitle
          name={t('Diff 差异对比')}
          desc={ t('代码差异对比使用highlight.js做代码高亮，所以在使用该组件之前，请先安装highlight.js依赖') }
          link={`${import.meta.env.VITE_APP_BASE_URL ?? ''}/code-diff`}
        />
        {demos.map(({ DemoComponent, ...demo }) => (
          <DemoBox {...demo}>
            <DemoComponent />
          </DemoBox>
        ))}
        <PropsBox title={ t('CodeDiff 属性') } subtitle="" propsData={codeDiffProps} />
      </div>
    );
  },
});
