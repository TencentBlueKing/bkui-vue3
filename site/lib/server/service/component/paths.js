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

import { RELEASE_DIR, RELEASE_DIST_DIR } from '../../common';
import { validateVersion } from '../validate';

// 获取编译产物文件路径，并确保所在目录存在
export const getDistFilePath = (version, component, type, file) => {
  const dir = type === 'directive'
    ? path.resolve(RELEASE_DIST_DIR, `${version}`, 'directives', 'src', `${component}.js`)
    : path.resolve(RELEASE_DIST_DIR, `${version}`, component, 'src');
  fs.mkdirSync(dir, { recursive: true });
  return path.resolve(dir, file);
};

// 获取组件 release 源码包路径；dev 版本不存在时从 packages 源码复制
export const getReleaseZipPath = async (version) => {
  const releaseZipPath = path.resolve(RELEASE_DIR, `${validateVersion(version)}`);
  if (version === 'dev' && !fs.existsSync(releaseZipPath)) {
    const sourcePath = path.resolve(__dirname, '../../../../../packages');
    fs.cpSync(sourcePath, releaseZipPath, {
      recursive: true,
      force: true,
    });
  }
  return releaseZipPath;
};

// 获取构建产物目录路径
export const getReleaseDistPath = async (version) => {
  return path.resolve(RELEASE_DIST_DIR, `${validateVersion(version)}`);
};
