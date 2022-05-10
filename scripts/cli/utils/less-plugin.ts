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
import fs from 'fs';
import path from 'path';

import { COMPONENT_URL } from '../compiler/helpers';
export const fileCheckRegex = /^@bkui-vue\/([^/]*)/;
export function resolveUrl(filename: string) {
  let url = '';
  try {
    if (!filename.match(fileCheckRegex)) return filename;
    url = filename.replace(fileCheckRegex, path.resolve(COMPONENT_URL, './$1/src'));
    if (!fs.existsSync(url)) {
      url = '';
    }
  } catch (e) {
    console.error(e);
  }
  if (!url) {
    const error = new Error(`[less-plugin-resolve-path]: '${filename}' not found.`);
    console.error(error);
    throw error;
  }
  return url;
}
export default class LessResolvePathPlugin {
  install(less: LessStatic, pluginManager: Less.PluginManager) {
    class ResolvePathPlugin extends less.FileManager {
      supports(filename: string) {
        return !!filename.match(fileCheckRegex);
      }

      supportsSync(filename: string) {
        return this.supports(filename);
      }

      loadFile(
        filename: string,
        currentDirectory: string,
        options: Record<string, unknown>,
        enviroment: Less.Environment,
      ) {
        return super.loadFile(resolveUrl(filename), currentDirectory, options, enviroment);
      }

      loadFileSync(
        filename: string,
        currentDirectory: string,
        options: Record<string, unknown>,
        enviroment: Less.Environment,
      ) {
        return super.loadFileSync(resolveUrl(filename), currentDirectory, options, enviroment);
      }
    }
    pluginManager.addFileManager(new ResolvePathPlugin());
  }
}
