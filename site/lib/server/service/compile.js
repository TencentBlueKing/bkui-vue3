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

import LessResolvePathPlugin from '../scripts/less-plugin.js';

// 组件公共依赖
const externals = {
  vue: 'vue',
  lodash: 'lodash',
  uuid: 'uuid',
  'lodash/throttle': 'lodashThrottle',
  'lodash/merge': 'lodashMerge',
  'lodash/cloneDeep': 'lodashCloneDeep',
  '@popperjs/core': 'popperjsCore',
  'vue-types': 'vueTypes',
  '@floating-ui/dom': 'floatingUiDom',
  'normalize-wheel': 'normalizeWheel',
  'js-calendar': 'jsCalendar',
  'date-fns': 'dateFns',
};

// 转换路径分隔符为 /
export const normalize = file => file.replace(/\\/g, '/');

// 解析路径
export const resolve = (...files) => normalize(path.resolve(...files));

/**
 * 生成函数名（基于文件路径）
 * @param {*} absolutePath 文件绝对路径
 * @param {*} releaseZipPath zip 地址
 * @returns 函数名
 */
const generateFunctionName = (absolutePath, releaseZipPath) => {
  return absolutePath
    .replace(releaseZipPath, '')
    .replace(/[-//.]/g, '_')
    .replace(/:/g, '_');
};

/**
 * 获取依赖的绝对路径
 * @param {*} originAbsoluteFilePath 文件初始绝对地址
 * @param {*} dependencyPath 依赖地址
 * @returns 依赖的绝对地址
 */
const getDependencyAbsolutePath = (originAbsoluteFilePath, dependencyPath) => {
  if (externals[dependencyPath]) {
    return externals[dependencyPath]; // 如果是外部依赖，直接返回
  }
  // 处理相对路径
  const originAbsoluteDir = path.dirname(originAbsoluteFilePath);
  return resolve(originAbsoluteDir, dependencyPath);
};

/**
 * 核心转换函数
 * @param {*} code 文件内容
 * @param {*} originAbsoluteFilePath 原始文件绝对地址
 * @param {*} releaseZipPath zip 地址
 * @returns 转换后的文件内容
 */
const transformFileContent = (code, originAbsoluteFilePath, releaseZipPath) => {
  // 去除注释
  let transformedCode = code.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1');

  transformedCode = transformedCode.replace(/"use strict";/g, 'const exports = {}');

  transformedCode = transformedCode.replace(/require\(['"](.*?)['"]\);?/g, (match, dependencyPath) => {
    if (!dependencyPath) return match;
    const funcName = generateFunctionName(
      getDependencyAbsolutePath(originAbsoluteFilePath, dependencyPath),
      releaseZipPath,
    );
    return `${funcName}()`;
  });

  transformedCode += 'return exports';

  return transformedCode;
};

/**
 * 构建 @bkui-vue 别名
 * @param {*} releaseZipPath release 目录绝对路径
 * @returns 别名映射
 */
const buildBkuiAlias = (releaseZipPath) => {
  const names = fs.readdirSync(releaseZipPath).filter(n => fs.existsSync(resolve(releaseZipPath, n, 'src')));
  const map = {};
  for (const name of names) {
    map[`@bkui-vue/${name}`] = resolve(releaseZipPath, name, 'src');
  }
  return map;
};

/**
 * 获取编译上下文
 * @param {*} releaseZipPath zip 路径
 * @param {*} entryPath 入口文件路径
 * @returns context
 */
const getCompileContext = (releaseZipPath, entryPath, preserveModuleType, options = {}) => {
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
      configureWebpack: {
        ...options?.configureWebpack,
        resolve: {
          alias: {
            // '@bkui-vue': releaseZipPath,
            ...buildBkuiAlias(releaseZipPath),
            ...(options?.configureWebpack?.resolve?.alias || {}),
          },
        },
      },
    },
  };
};

/**
 * @description 编译demo文件
 */
export const compileDemo = async (releaseZipPath, entryPath) => {
  const fileMap = {};
  // 构建配置
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

/**
 * 构造编译后的文件
 * @param {*} fileMap 文件map
 * @param {*} entryPath 入口文件地址
 */
export const generateCompiledFile = async (fileMap, entryPath, releaseZipPath) => {
  const entryFile = fileMap[entryPath];
  const transformedEntryFileContent = transformFileContent(
    entryFile.content,
    entryFile.originAbsoluteFilePath,
    releaseZipPath,
  );
  const transformedDependenciesContent = Object.values(fileMap).reduce((acc, cur) => {
    if (cur.originAbsoluteFilePath !== entryPath) {
      acc += `function ${generateFunctionName(cur.outputAbsoluteFilePath, releaseZipPath)}() {
        ${transformFileContent(cur.content, cur.originAbsoluteFilePath, releaseZipPath)}
        }\n`;
    }
    return acc;
  }, '');
  return `window.getComponent = () => {\n${transformedDependenciesContent}\n${transformedEntryFileContent}\n}`;
};

/**
 * 获取组件入口文件
 * @param {*} releaseZipPath zip包路径
 * @param {*} component 组件名
 * @returns 组件入口文件
 */
const getComponentEntryPath = (releaseZipPath, component) => {
  const possibleEntryFiles = ['src/index.js', 'src/index.ts', 'src/index.tsx', 'src/index.jsx'];

  let entryPath = null;
  for (const entryFile of possibleEntryFiles) {
    const testPath = resolve(releaseZipPath, component, entryFile);
    if (fs.existsSync(testPath) && fs.statSync(testPath).isFile()) {
      entryPath = testPath;
      break;
    }
  }

  if (!entryPath) {
    throw new Error(`找不到 ${component} 组件的入口文件`);
  }
  return entryPath;
};

/**
 * @description 编译组件文件
 */
export const compileComponent = async (releaseZipPath, component) => {
  // 组件文件
  const fileMap = {};
  // 构建配置
  const options = {
    configureWebpack: {
      externals,
    },
  };
  // 路径
  const entryPath = getComponentEntryPath(releaseZipPath, component);

  // 生成上下文
  const context = getCompileContext(releaseZipPath, entryPath, 'commonjs', options);
  // 编辑
  await buildModule(fileMap, context);
  // 转换
  await transform(fileMap, context);
  // 输出，减少二次编译
  // 添加路径一致判断，避免报错
  if (
    context.options.preserveModulesRoot
    && context.options.outputPreserveModuleDir
    && context.options.preserveModulesRoot !== context.options.outputPreserveModuleDir
  ) {
    await emit(fileMap, context);
  }
  // 生成组件文件
  return generateCompiledFile(fileMap, entryPath, releaseZipPath);
};

/**
 * 编译组件css
 * @param {*} releaseZipPath zip包路径
 * @param {*} component 组件名
 * @returns
 */
export const compileCss = async (releaseZipPath, component) => {
  // 组件文件
  const fileMap = {};
  // 路径
  const entryPath = resolve(releaseZipPath, component, `src/${component}.less`);
  // less 文件不存在返回空
  if (!fs.existsSync(entryPath)) return '';
  // 构建配置
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
  // 生成上下文
  const context = getCompileContext(releaseZipPath, entryPath, 'commonjs', options);
  // 编辑
  await buildModule(fileMap, context);
  // 转换
  await transform(fileMap, context);
  // 输出，减少二次编译
  await emit(fileMap, context);

  return fileMap[entryPath].content;
};
