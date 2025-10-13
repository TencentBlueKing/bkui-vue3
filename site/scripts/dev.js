/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
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

const path = require('path');
const nodemon = require('nodemon');
const chalk = require('chalk');
const { runDev } = require('@blueking/cli-service');
const rimraf = require('rimraf');

const backendDir = path.resolve(__dirname, '../lib/server');
const sharedDir = path.resolve(__dirname, '../lib/shared');
const releaseZipsDir = path.resolve(__dirname, '../lib/server/release-dir');
const releaseDistDir = path.resolve(__dirname, '../lib/server/release-dist');

function startServer() {
  nodemon({
    script: path.resolve(backendDir, 'app.browser.js'),
    watch: [
      backendDir,
      sharedDir,
    ],
    ignore: [
      releaseZipsDir,
      releaseDistDir,
    ],
    nodeArgs: [
      '--inspect',
    ],
    ext: 'js',
  })
    .once('start', () => {
      runDev();
    })
    .on('quit', () => {
      console.log('\n', chalk.yellow('API server has quit'), '\n');
      process.exit();
    })
    .on('crash', () => {
      console.log('\n', chalk.red('API server crashed'), '\n');
    })
    .on('restart', () => {
      // 清空 release-dist 目录
      rimraf.sync(releaseDistDir);
      // 打印日志
      console.log('\n', chalk.yellow('API server restarted'), '\n');
    });
}

startServer();
