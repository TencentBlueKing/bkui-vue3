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
import { readFileSync } from 'fs';
import { resolve } from 'path';
import webpack from 'webpack';

import { capitalize, hasStyleComponentList } from './babel-plugin';
import { COMPONENT_URL } from './helpers';
export default class RemoveWildcardImportsPlugin {
  apply(compiler: webpack.Compiler): void {
    compiler.hooks.emit.tap('RemoveWildcardImportsPlugin', compilation => {
      Object.keys(compilation.assets).forEach(filename => {
        if (filename.endsWith('.js')) {
          const asset = compilation.assets[filename];
          const sourceString = asset.source().toString();
          const importPattern = /^import\s+\*\s+as\s+[^\s]+\s+from\s+"(.+less)";/gm;
          const bkuiLibPattern = /bkui-vue\/lib\//gm;
          let newSource = sourceString.replace(importPattern, 'import "$1";').replace(bkuiLibPattern, '../');
          const [componentName, compFilename] = filename.split('/');
          if (compFilename === 'index.js' && hasStyleComponentList.includes(capitalize(componentName))) {
            newSource = `import "./${componentName}.less";\n${newSource}`;
          } else if (compFilename === undefined) {
            const url = resolve(COMPONENT_URL, `./bkui-vue/${filename.replace(/\.js$/, '')}.ts`);
            let source = readFileSync(url, 'utf-8');
            const matchList = source.match(/export\s+type[^;]+;/gm);
            matchList?.forEach(match => {
              source = source.replace(match, '');
            });
            newSource = source.replace(/@bkui-vue\//gm, './');
          }
          if (newSource !== sourceString) {
            compilation.assets[filename] = {
              source: () => newSource,
              size: () => newSource.length,
            } as any;
          }
        }
      });
    });
  }
}
