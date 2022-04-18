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
import { basename, extname } from 'path';
import { GlobalsOption } from 'rollup';
import { parentPort } from 'worker_threads';

import { rollupBuildScript } from '../compiler/compile-script';
import { compileStyle } from '../compiler/compile-style';
import { ITaskItem } from '../typings/task';

import { writeFileRecursive } from './utils';
parentPort.on('message', ({ task, globals }) => {
  (task.type === 'style'
    ?  compileStyleTask(task)
    :  compileScript(task, globals)).finally(() => {
    parentPort.postMessage(task);
  });
});
async function compileStyleTask({ url, newPath }: ITaskItem) {
  const spinner = ora(`building style ${url} \n`).start();
  const { css, resource, varCss } = await compileStyle(url).catch(() => ({
    css: '',
    resource: '',
    varCss: '',
  }));
  css.length && writeFileRecursive(newPath.replace(/\.(css|less|scss)$/, '.css'), css);
  resource.length && writeFileRecursive(newPath, resource);
  varCss.length && writeFileRecursive(newPath.replace(/\.(css|less|scss)$/, '.variable.css'), varCss);
  css.length ? spinner.succeed() : spinner.fail();
}
async function compileScript({ url, newPath }: ITaskItem, globals: GlobalsOption) {
  const spinner = ora(`building script ${url} \n`).start();
  if (basename(url).replace(extname(url), '') === 'index' || /\/icon\/icons\//.test(url)) {
    console.time(url);
    await rollupBuildScript(url, newPath.replace(/\.(js|ts|jsx|tsx)$/, '.js'), globals)
      .catch(() => spinner.fail())
      .then(() => spinner.succeed());
    console.timeEnd(url);
    spinner.stop();
    spinner.clear();
  } else {
    spinner.succeed();
    spinner.stop();
    spinner.clear();
  }
}
