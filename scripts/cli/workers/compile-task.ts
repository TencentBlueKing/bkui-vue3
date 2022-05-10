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
import { exec } from 'child_process';
import { GlobalsOption } from 'rollup';
import { promisify } from 'util';

import packageJson from '../../../package.json';
import { ILibTaskOption, ITaskItem } from '../typings/task';

import { WorkerPool } from './worker-pools';
export class CompileTask {
  globals: GlobalsOption | null = null;
  constructor(public taskItemList: ITaskItem[], public taskOption: ILibTaskOption) { }
  async getRollupGlobals() {
    const { stdout } = await promisify(exec)('yarn workspaces info --json');
    const globals: GlobalsOption = {};
    Object.keys(JSON.parse(stdout)).forEach((k) => {
      if (k === '@bkui-vue/icon') {
        globals[k] = `${k}/icons`;
      } else {
        globals[k] = k.replace(
          /^@bkui-vue\/(.+)$/,
          (_char, match) => match.replace(/^\S/, (s: string) => s.toUpperCase()),
        ).replace(/(-(\w))/, (_char, match, match2) => match2.toUpperCase());
      }
    });
    Object.keys({ ...packageJson.dependencies, ...packageJson.peerDependencies }).forEach((key) => {
      globals[key] = key;
    });
    this.globals = globals;
  }
  async start() {
    // !this.globals && await this.getRollupGlobals();
    const styleList = this.taskItemList.filter(item => item.type === 'style');
    const scriptList: ITaskItem[][] = [];
    this.taskItemList
      .filter(item => item.type === 'script')
      .reduce((pre: ITaskItem[], cur: ITaskItem, index, list) => {
        if (pre.length <= (this.taskOption.analyze ? list.length : Math.ceil(list.length / 2))) {
          pre.push(cur);
          if (index === list.length - 1) {
            scriptList.push(pre);
            return [];
          }
          return pre;
        }
        scriptList.push(pre);
        return [];
      }, []);
    const workerPool = new WorkerPool(Math.min(10, styleList.length + scriptList.length));
    let i = scriptList.length;
    [...styleList, ...scriptList].forEach((item) => {
      workerPool.run<ITaskItem | ITaskItem[]>(item, this.taskOption, (err: Error, task) => {
        err && console.error(err);
        if (Array.isArray(task)) {
          i -= 1;
          i === 0 && workerPool.close();
        }
      });
    });
  }
}
