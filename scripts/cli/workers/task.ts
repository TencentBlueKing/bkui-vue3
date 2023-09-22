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

import ora from 'ora';
import { parentPort } from 'worker_threads';

import { compileStyle } from '../compiler/compile-style';
import { writeFileRecursive } from '../compiler/helpers';
import { webpackBuildScript } from '../compiler/webpack-script';
import { ILibTaskOption, ITaskItem } from '../typings/task';

parentPort!.on('message', ({ task, taskOption }) => {
  (task.type === 'style'
    ? compileStyleTask(task)
    : compileScript(task, taskOption).catch(() => {
        parentPort!.postMessage(null);
      })
  ).finally(() => {
    parentPort!.postMessage(task);
  });
});
async function compileStyleTask({ url, newPath }: ITaskItem) {
  const spinner = ora(`building style ${url} \n`).start();
  const { css, resource, varCss } = await compileStyle(url).catch(() => ({
    css: '',
    resource: '',
    varCss: '',
  }));
  const isConfigProviderComponent = /config-provider\.less$/.test(url);
  (css.length || isConfigProviderComponent) && writeFileRecursive(newPath.replace(/\.(css|less|scss)$/, '.css'), css);
  resource.length && writeFileRecursive(newPath, resource);
  varCss.length && writeFileRecursive(newPath.replace(/\.(css|less|scss)$/, '.variable.css'), varCss);
  css.length ? spinner.succeed() : spinner.fail();
}
async function compileScript(list: ITaskItem[], taskOption: ILibTaskOption) {
  console.info(list.length, '++++++++++');
  return webpackBuildScript(list, taskOption);
}
