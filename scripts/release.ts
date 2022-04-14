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

import childProcess from 'child_process';
import fs from 'fs';
import path from 'path';

const packagePath = path.resolve(__dirname, '../package.json');
const packageTmpPath = path.resolve(__dirname, '../package.json.bak');

(async function () {
  const originalData = fs.readFileSync(packagePath, { encoding: 'utf8' });
  fs.writeFileSync(packageTmpPath, originalData);

  const packageData = JSON.parse(originalData);
  delete packageData.private;
  delete packageData.scripts.cc;
  fs.writeFileSync(packagePath, `${JSON.stringify(packageData, null, 2)}\n`);

  const proc = childProcess.spawn(
    'npm',
    ['publish', '--access=public', '--unsafe-perm', '--registry', 'https://registry.npmjs.org'],
    { stdio: 'inherit' },
  );
  proc.on('close', () => {
    fs.unlinkSync(packageTmpPath);
    fs.writeFileSync(packagePath, originalData);
  });
}());
