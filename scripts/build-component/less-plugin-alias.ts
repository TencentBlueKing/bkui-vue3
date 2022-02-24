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

import path from 'path';
import fs from 'fs';

interface Options {
  [key: string]: string;
}

function normalizePath(filename: string) {
  if (/\.(?:less|css)$/i.test(filename)) {
    return fs.existsSync(filename) ? filename : undefined;
  }

  const checkExtList = ['.less', '.css'];

  for (let i = 0, len = checkExtList.length; i < len; i ++) {
    const ext = checkExtList[i];
    if (fs.existsSync(`${filename}${ext}`)) {
      return `${filename}${ext}`;
    }
  }
}

export default class LessPluginAlias {
  constructor(private options: Options) {
    this.options = options;
  }

  install(less: any, pluginManager: any) {
    const alias = this.options;

    function resolve(filename: string) {
      const aliasKeys = Object.keys(alias);
      if (new RegExp(aliasKeys.map(item => `^(${item})`).join('|'), 'gi').test(filename)) {
        const match = RegExp.$1;

        const restPath = filename.replace(match, '');
        const resolvedAlias = alias[match];

        let resolvedPath: string | undefined;
        if (Array.isArray(resolvedAlias)) {
          for (let i = 0, len = resolvedAlias.length; i < len; i ++) {
            resolvedPath = normalizePath(path.join(resolvedAlias[i], restPath));
            if (resolvedPath) {
              return resolvedPath;
            }
          }
        } else {
          resolvedPath = normalizePath(path.join(resolvedAlias, restPath));
        }
        if (!resolvedPath) {
          throw new Error(`Invalid alias config for key: ${match}`);
        }
        return resolvedPath;
      }

      return filename;
    }

    class AliasPlugin extends less.FileManager {
      supports(filename: string, currentDirectory: string) {
        const aliasKeys = Object.keys(alias);
        const len = aliasKeys.length;

        for (let i = 0; i < len; i ++) {
          const key = `${aliasKeys[i]}`;
          if (filename.indexOf(key) !== -1 || currentDirectory.indexOf(key) !== -1) {
            return true;
          }
        }
        return false;
      }

      supportsSync(filename: string, currentDirectory: string) {
        return this.supports(filename, currentDirectory);
      }

      loadFile(
        filename: string, currentDirectory: string,
        options: Record<string, unknown>, enviroment: Less.Environment,
      ) {
        let resolved;
        try {
          resolved = resolve(filename);
        } catch (error) {
          console.error(error);
        }
        if (!resolved) {
          const error = new Error(`[less-plugin-alias]: '${filename}' not found.`);
          console.error(error);
          throw error;
        }
        return super.loadFile(resolved, currentDirectory, options, enviroment);
      }

      loadFileSync(
        filename: string, currentDirectory: string,
        options: Record<string, unknown>, enviroment: Less.Environment,
      ) {
        let resolved;
        try {
          resolved = resolve(filename);
        } catch (error) {
          console.error(error);
        }
        if (!resolved) {
          const error = new Error(`[less-plugin-alias]: '${filename}' not found.`);
          console.error(error);
          throw error;
        }
        return super.loadFileSync(resolved, currentDirectory, options, enviroment);
      }
    }

    pluginManager.addFileManager(new AliasPlugin());
  }
}
