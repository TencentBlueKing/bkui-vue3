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

// const { exec } = require('child_process');
// const ora = require('ora');
// const { basename, extname } = require('path');
// const { promisify } = require('util');
// const { parentPort } = require('worker_threads');

// const { rollupBuildScript } = require('../compiler/compile-script');
// const { compileStyle } = require('../compiler/compile-style');

// const { writeFileRecursive } = require('./utils');
// let globals = null;
// async function getRollupGlobals() {
//   const { stdout } = await promisify(exec)('yarn workspaces info --json');
//   const rollupGlobals = {};
//   Object.keys(JSON.parse(stdout)).forEach((k) => {
//     if (k === '@bkui-vue/icon') {
//       rollupGlobals[k] = `${k}/icons`;
//     } else {
//       rollupGlobals[k] = k.replace(
//         /^@bkui-vue\/(\w+)$/,
//         (_char, match) => match.replace(/^\S/, s => s.toUpperCase()),
//       );
//     }
//   });
//   rollupGlobals.vue = 'Vue';
//   rollupGlobals['vue-types'] = 'vue-types';
//   globals = rollupGlobals;
// }
// parentPort.on('message', (task) => {
//   (task.type === 'style'
//     ?  compileStyleTask(task)
//     :  compileScript(task)).finally(() => {
//     parentPort.postMessage(task);
//   });
// });
// async function compileStyleTask({ url, newPath }) {
//   const spinner = ora(`building style ${url} \n`).start();
//   const { css, resource, varCss } = await compileStyle(url).catch(() => ({
//     css: '',
//     resource: '',
//     varCss: '',
//   }));
//   css.length && writeFileRecursive(newPath.replace(/\.(css|less|scss)$/, '.css'), css);
//   resource.length && writeFileRecursive(newPath, resource);
//   varCss.length && writeFileRecursive(newPath.replace(/\.(css|less|scss)$/, '.variable.css'), varCss);
//   css.length ? spinner.succeed() : spinner.fail();
// }
// async function compileScript({ url, newPath }) {
//   if (!globals) {
//     await getRollupGlobals();
//   }
//   const spinner = ora(`building script ${url} \n`).start();
//   if (basename(url).replace(extname(url), '') === 'index' || /\/icon\/icons\//.test(url)) {
//     await rollupBuildScript(url, newPath.replace(/\.(js|ts|jsx|tsx)$/, '.js'), globals)
//       .catch(() => spinner.fail())
//       .then(() => spinner.succeed())
//       .finally(() => {
//         spinner.stop();
//         spinner.clear();
//         // this.pushTask();
//       });
//   } else {
//     spinner.succeed();
//     spinner.stop();
//     spinner.clear();
//     // this.pushTask();
//   }
// }


const path = require('path');
require('ts-node').register({
  // files: path.resolve(__dirname, './task.ts'),
  project: '/Users/liangling/code/githubCode/bkui-vue3/scripts/tsconfig.scripts.json',
  // compilerOptions: {
  //   target: 'ES2019',
  //   module: 'commonjs',
  //   strict: true,
  //   declaration: true,
  //   skipLibCheck: true,
  //   esModuleInterop: true,
  // },
});
require(path.resolve(__dirname, './task.ts'));
