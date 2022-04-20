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

import { readFile } from 'fs/promises';
import { render } from 'less';
import { resolve } from 'path';
import postcss from 'postcss';
import postcssLess from 'postcss-less';

import { LessPluginAlias, transformImport } from './helpers';

const styleDir = resolve(__dirname, '../../../packages/styles/src');
export const compileStyle = async (url: string) => {
  const resource =  await readFile(url, 'utf-8');
  const varResource = resource.replace(/\/themes\/themes\.less/gmi, '/themes/themes.variable.less');
  const { css } = await render(resource, {
    filename: url,
    plugins: [
      new LessPluginAlias({
        '@bkui-vue/styles': styleDir,
      }),
    ],
  });
  const { css: varCss } = await render(varResource, {
    filename: url,
    plugins: [
      new LessPluginAlias({
        // @import '@bkui-vue/styles/mixins/mixins.less'; => @import 'bkui-vue/packages/styles/src/mixins/mixins.less';
        '@bkui-vue/styles': styleDir,
      }),
    ],
  });
  const ret = await postcss([transformImport({
    '@bkui-vue/styles': styleDir,
    from: undefined,
  })]).process(resource, { syntax: postcssLess });

  return { css, varCss, resource: ret.css };
};

export const compileTheme = async (url: string) => {
  const resource = await readFile(url, 'utf-8');
  return `:root {
    ${resource.replace(/@([^:]+):([^;]+);/gmi, '--$1:$2;').replace(/@([^;]+);/gmi, 'var(--$1);')}
  }
  ${resource.replace(/@([^:]+):([^;]+);/gmi, '@$1: var(--$1);').replace('var(--bk-prefix)', 'bk')}
  `;
};
