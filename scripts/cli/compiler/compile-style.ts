/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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

import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { render } from 'less';
import { resolve } from 'path';
import postcss from 'postcss';
import postcssLess from 'postcss-less';

import LessResolvePathPlugin from '../utils/less-plugin';
import { transformCssImport } from '../utils/postcss-plugin';
import { BKUI_DIR } from './helpers';

const nodeModulesPath = resolve(BKUI_DIR, 'node_modules');

async function inlineNodeModulesCss(source: string): Promise<string> {
  const importRegex = /@import\s+(?:\(inline\)\s+)?['"]([^@.][^'"]*\.css)['"]\s*;/g;
  let result = source;
  let match;
  while ((match = importRegex.exec(source)) !== null) {
    const fullPath = resolve(nodeModulesPath, match[1]);
    if (existsSync(fullPath)) {
      const content = await readFile(fullPath, 'utf-8');
      result = result.replace(match[0], content);
    }
  }
  return result;
}

export const compileStyle = async (url: string) => {
  const resource = await readFile(url, 'utf-8');
  const varResource = resource.replace(/\/themes\/themes\.less/gim, '/themes/themes.variable.less');
  const { css } = await render(resource, {
    filename: url,
    paths: [nodeModulesPath],
    plugins: [new LessResolvePathPlugin()],
  });
  const { css: varCss } = await render(varResource, {
    filename: url,
    paths: [nodeModulesPath],
    plugins: [new LessResolvePathPlugin()],
  });
  const inlinedResource = await inlineNodeModulesCss(resource);
  const ret = await postcss([transformCssImport(url)]).process(inlinedResource, { syntax: postcssLess });
  return { css, varCss, resource: ret.css };
};

export const compileTheme = async (url: string) => {
  const resource = await readFile(url, 'utf-8');
  return `:root {
    ${resource.replace(/@([^:]+):([^;]+);/gim, '--$1:$2;').replace(/@([^;]+);/gim, 'var(--$1);')}
  }
  ${resource.replace(/@([^:]+):([^;]+);/gim, '@$1: var(--$1);').replace('var(--bk-prefix)', 'bk')}
  `;
};
