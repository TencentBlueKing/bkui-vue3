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

import { lstatSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

import { compileFile, compilerLibDir  } from './compiler/compile-lib';
import {  compileTheme } from './compiler/compile-style';
import { ICompileTaskOption, ITaskItem } from './typings/task';
import { CompileTask } from './workers/compile-task';
import { writeFileRecursive } from './workers/utils';

const compileDirUrl = resolve(__dirname, '../../packages');
const libDirUrl =  resolve(__dirname, '../../lib');
const themeLessUrl = resolve(compileDirUrl, 'styles/src/themes/themes.less');

export const compilerDir = async (dir: string): Promise<any> => {
  // const urlList: any = [];
  const list: ITaskItem[] = [];
  const buildDir: any = (dir: string) => {
    const files = readdirSync(dir);
    files.forEach((file) => {
      const url = join(dir, file);
      if (/(node_modules|__test__|\.test\.*)/.test(url)) {
        return ;
      }
      if (lstatSync(url).isDirectory()) {
        buildDir(url);
      }
      const data = compileFile(url, compileDirUrl, libDirUrl);
      data && list.push(data);
    });
  };
  buildDir(dir);
  const taskInstance = new CompileTask(list);
  taskInstance.start();
};


// 将theme.less 装换为 css变量
const compileThemeTovariable = async () => {
  const resource = await compileTheme(themeLessUrl);
  await writeFileRecursive(themeLessUrl.replace(/\.(css|less|scss)$/, '.variable.$1'), resource);
};
export default async (option: ICompileTaskOption) => {
  if (option.compile) {
    compilerLibDir(libDirUrl);
    await compileThemeTovariable();
    compilerDir(compileDirUrl);
  }
};
