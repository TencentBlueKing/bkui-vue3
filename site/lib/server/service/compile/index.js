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
import fs from 'node:fs';
import path from 'node:path';

import { emit } from '@blueking/cli-service/dist/tools/rust/emit/index.js';
import { buildModule } from '@blueking/cli-service/dist/tools/rust/module/index.js';
import { transform } from '@blueking/cli-service/dist/tools/rust/transform/index.js';

import { RELEASE_DIST_DIR } from '../../common';
import LessResolvePathPlugin from '../../scripts/less-plugin.js';

import { externals } from './externals';
import { generateFunctionName, resolve, transformFileContent } from './transform';

export { normalize, resolve } from './transform';

// 构建 @bkui-vue 别名映射（指向各组件 src 目录）
const buildBkuiAlias = (releaseZipPath) => {
  const names = fs.readdirSync(releaseZipPath).filter(n => fs.existsSync(resolve(releaseZipPath, n, 'src')));
  const map = {};
  for (const name of names) {
    map[`@bkui-vue/${name}`] = resolve(releaseZipPath, name, 'src');
  }
  return map;
};

// 获取编译上下文
const getCompileContext = (releaseZipPath, entryPath, preserveModuleType, options = {}) => {
  const version = path.basename(releaseZipPath);
  return {
    workDir: releaseZipPath,
    options: {
      ...options,
      preserveModuleType,
      resource: {
        main: {
          entry: entryPath,
        },
      },
      preserveModulesRoot: releaseZipPath,
      outputPreserveModuleDir: path.resolve(RELEASE_DIST_DIR, `${version}`),
      configureWebpack: {
        ...options?.configureWebpack,
        resolve: {
          alias: {
            ...buildBkuiAlias(releaseZipPath),
            ...(options?.configureWebpack?.resolve?.alias || {}),
          },
        },
      },
    },
  };
};

// 获取组件入口文件路径
const getComponentEntryPath = (releaseZipPath, component, type) => {
  if (type === 'directive') {
    return resolve(releaseZipPath, 'directives', `src/${component}.ts`);
  }

  const possibleEntryFiles = ['src/index.js', 'src/index.ts', 'src/index.tsx', 'src/index.jsx'];
  for (const entryFile of possibleEntryFiles) {
    const testPath = resolve(releaseZipPath, component, entryFile);
    if (fs.existsSync(testPath) && fs.statSync(testPath).isFile()) {
      return testPath;
    }
  }

  throw new Error(`找不到 ${component} 组件的入口文件`);
};

// 将编译后的文件 map 拼装为可在浏览器运行的单文件代码
export const generateCompiledFile = async (fileMap, entryPath, releaseZipPath) => {
  const transformedDependenciesContent = Object.values(fileMap).reduce((acc, cur) => {
    const funcName = generateFunctionName(cur.outputAbsoluteFilePath, releaseZipPath);
    acc += `function ${funcName}() {
      ${transformFileContent(cur.content, cur.originAbsoluteFilePath, releaseZipPath, funcName)}
    }\n`;
    return acc;
  }, '');
  const entryFile = fileMap[entryPath];
  const entryFileFuncName = generateFunctionName(entryFile.outputAbsoluteFilePath, releaseZipPath);
  return `window.process = { env: { NODE_ENV: 'production' } }; window.getComponent = () => {\n${transformedDependenciesContent}\nreturn ${entryFileFuncName}();\n}`;
};

// 编译 demo 文件
export const compileDemo = async (releaseZipPath, entryPath) => {
  const fileMap = {};
  const options = {
    configureWebpack: {
      externals,
    },
  };
  const context = getCompileContext(releaseZipPath, entryPath, 'commonjs', options);
  await buildModule(fileMap, context);
  await transform(fileMap, context);
  await emit(fileMap, context);
};

// 编译组件文件
export const compileComponent = async (releaseZipPath, component, type) => {
  const fileMap = {};
  const options = {
    configureWebpack: {
      externals,
    },
  };
  const entryPath = getComponentEntryPath(releaseZipPath, component, type);
  const context = getCompileContext(releaseZipPath, entryPath, 'commonjs', options);
  await buildModule(fileMap, context);
  await transform(fileMap, context);
  // 输出，减少二次编译
  await emit(fileMap, context);
  return generateCompiledFile(fileMap, entryPath, releaseZipPath);
};

// 编译组件 CSS
export const compileCss = async (releaseZipPath, component, type) => {
  const fileMap = {};
  const entryPath = type === 'directive'
    ? resolve(releaseZipPath, 'directives', 'demo', `src/${component}.ts`)
    : resolve(releaseZipPath, component, `src/${component}.less`);
  // less 文件不存在返回空
  if (!fs.existsSync(entryPath)) return '';

  const options = {
    configureWebpack: {
      externals: {
        '@bkui-vue/styles': resolve(releaseZipPath, 'styles/src'),
      },
    },
    css: {
      lessLoaderOptions: {
        plugins: [new LessResolvePathPlugin()],
      },
    },
  };
  const context = getCompileContext(releaseZipPath, entryPath, 'commonjs', options);
  await buildModule(fileMap, context);
  await transform(fileMap, context);
  await emit(fileMap, context);

  return fileMap[entryPath].content;
};
