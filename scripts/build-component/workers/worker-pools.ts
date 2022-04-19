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
import { AsyncResource } from 'async_hooks';
import { EventEmitter } from 'events';
import path from 'path';
import { GlobalsOption } from 'rollup';
import  { Worker } from 'worker_threads';
const buildTask = Symbol('BKUI_BUILD');
const buildEvent = Symbol('BKUI_BUILD_EVENT');
const BUILD_TASK = 'BUILD_TASK';
EventEmitter.setMaxListeners(50);
class WorkerPoolTaskInfo extends AsyncResource {
  callback: <T>(err: Error, task: T) => void;
  constructor(callback: <T>(err: Error, task: T) => void) {
    super(BUILD_TASK);
    this.callback = callback;
  }

  done(err: Error, result: any) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();
  }
}

export class WorkerPool extends EventEmitter {
  size: number;
  workers: Worker[];
  freeWorkers: Worker[];
  globals: GlobalsOption;
  constructor(size: number) {
    super();
    this.size = size;
    this.workers = [];
    this.freeWorkers = [];
    for (let i = 0; i < size; i++) this.add();
  }
  add() {
    const worker = new Worker(path.resolve(__dirname, './task.js'));
    worker.on('message', (result) => {
      worker[buildTask].done(null, result);
      worker[buildTask] = null;
      this.freeWorkers.push(worker);
      this.emit(buildEvent);
    });
    worker.on('error', (err) => {
      if (worker[buildTask]) worker[buildTask].done(err, null);
      else this.emit('error', err);
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.add();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(buildEvent);
  }

  run<T>(task: T, globals: GlobalsOption, callback: <T>(err: Error, task: T) => void) {
    if (this.freeWorkers.length === 0) {
      this.once(buildEvent, () => this.run(task, globals, callback));
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[buildTask] = new WorkerPoolTaskInfo(callback);
    worker.postMessage({ task, globals });
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}

