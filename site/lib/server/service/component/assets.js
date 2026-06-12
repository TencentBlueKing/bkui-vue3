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

import { COMPILE_CSS_FILE, COMPILE_JS_FILE } from '../../common';
import { compileComponent, compileCss } from '../compile';
import { validateVersion } from '../validate';

import { getDistFilePath } from './paths';

// 读取编译产物；不存在时先编译并写盘缓存，再返回内容
const readOrCompile = async (compiledPath, compile, encoding) => {
  if (!fs.existsSync(compiledPath)) {
    const compiled = await compile();
    fs.writeFileSync(compiledPath, compiled, 'utf-8');
  }
  return encoding ? fs.readFileSync(compiledPath, encoding) : fs.readFileSync(compiledPath);
};

// 获取组件编译后的 JS（带产物缓存）
export const getComponent = async (releaseZipPath, component, version, type) => {
  const compiledJsPath = getDistFilePath(validateVersion(version), component, type, COMPILE_JS_FILE);
  return readOrCompile(compiledJsPath, () => compileComponent(releaseZipPath, component, type));
};

// 获取组件编译后的 CSS（带产物缓存）
export const getCss = async (releaseZipPath, component, version, type) => {
  const compiledCssPath = getDistFilePath(validateVersion(version), component, type, COMPILE_CSS_FILE);
  return readOrCompile(compiledCssPath, () => compileCss(releaseZipPath, component, type), 'utf-8');
};
