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
import path from 'node:path';

import { isImageFile } from '../../util';

import { externals } from './externals';

// 转换路径分隔符为 /
export const normalize = file => file.replace(/\\/g, '/');

// 解析路径并归一化分隔符
export const resolve = (...files) => normalize(path.resolve(...files));

// 基于文件路径生成唯一函数名
export const generateFunctionName = (absolutePath, releaseZipPath) => {
  return absolutePath
    .replace(releaseZipPath, '')
    .replace(/[-//.]/g, '_')
    .replace(/:/g, '_');
};

// 获取依赖的绝对路径（外部依赖直接返回全局变量名，相对路径基于源文件目录解析）
export const getDependencyAbsolutePath = (originAbsoluteFilePath, dependencyPath) => {
  if (externals[dependencyPath]) {
    return externals[dependencyPath];
  }
  const originAbsoluteDir = path.dirname(originAbsoluteFilePath);
  return resolve(originAbsoluteDir, dependencyPath);
};

// 核心转换函数：将单个文件内容转换为可在运行时按需求值的函数体
export const transformFileContent = (code, originAbsoluteFilePath, releaseZipPath, funcName) => {
  // 命中缓存直接返回
  let transformedCode = `if (${funcName}.exports) { return ${funcName}.exports; }\n`;

  // 立即缓存，避免循环依赖
  transformedCode += 'const exports = {};\n';
  transformedCode += `${funcName}.exports = exports;\n`;

  if (isImageFile(originAbsoluteFilePath)) {
    if (originAbsoluteFilePath.endsWith('.svg')) {
      // SVG 转换为 data URL
      const svgContent = code
        .replace(/\n/g, ' ')
        .replace(/\r/g, '')
        .replace(/\t/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const encodedSvg = svgContent
        .replace(/%/g, '%25')
        .replace(/#/g, '%23')
        .replace(/</g, '%3C')
        .replace(/>/g, '%3E')
        .replace(/"/g, '\'');
      transformedCode += `exports.default = "data:image/svg+xml,${encodedSvg}";\n`;
    } else {
      // 其他图片作为 base64
      const base64Content = Buffer.from(code, 'binary').toString('base64');
      const ext = path.extname(originAbsoluteFilePath).slice(1);
      transformedCode += `exports.default = "data:image/${ext};base64,${base64Content}";\n`;
    }
    transformedCode += 'Object.defineProperty(exports, "__esModule", { value: true });\nreturn exports;\n';
  } else {
    // 去除注释
    transformedCode += code.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1');
    // 去除严格模式
    transformedCode = transformedCode.replace(/"use strict";/g, '');
    // 处理 require 语句，替换为对应的函数调用
    transformedCode = transformedCode.replace(/require\(['"](.*?)['"]\);?/g, (match, dependencyPath) => {
      if (!dependencyPath) return match;
      const depFuncName = generateFunctionName(
        getDependencyAbsolutePath(originAbsoluteFilePath, dependencyPath),
        releaseZipPath,
      );
      return `${depFuncName}()`;
    });

    transformedCode += 'return exports';
  }

  return transformedCode;
};
