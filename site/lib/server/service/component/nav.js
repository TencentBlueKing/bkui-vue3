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

import { RELEASE_DIST_DIR } from '../../common';

import { customComponentList, startList } from './constants';
import { loadCompiledDemo } from './demo-loader';

// 收集内置组件的 demo，按分组聚合
const collectComponentGroups = async (releaseZipPath, version) => {
  const componentGroupMap = {};
  for (const componentPath of fs.readdirSync(releaseZipPath)) {
    const componentDemoPath = path.resolve(releaseZipPath, componentPath, 'demo/index.ts');
    if (!fs.existsSync(componentDemoPath)) continue;

    const compiledDemoPath = path.resolve(RELEASE_DIST_DIR, `${version}`, componentPath, 'demo/index.ts.js');
    const demo = await loadCompiledDemo(releaseZipPath, componentDemoPath, compiledDemoPath);
    componentGroupMap[demo.group] = componentGroupMap[demo.group] || [];
    componentGroupMap[demo.group].push(demo);
  }
  return componentGroupMap;
};

// 收集指令的 demo 列表
const collectDirectives = async (releaseZipPath, version) => {
  const directiveList = [];
  const directiveDemoDir = path.resolve(releaseZipPath, 'directives/demo');
  for (const directivePath of fs.readdirSync(directiveDemoDir)) {
    const directiveDemoPath = path.resolve(directiveDemoDir, directivePath);
    if (!fs.existsSync(directiveDemoPath)) continue;

    const compiledDemoPath = path.resolve(RELEASE_DIST_DIR, `${version}`, 'directives', 'demo', `${directivePath}.js`);
    const directive = await loadCompiledDemo(releaseZipPath, directiveDemoPath, compiledDemoPath);
    directiveList.push(directive);
  }
  return directiveList;
};

// 获取导航分组：内置组件分组、指令、自定义业务组件、开始分组
export const getNavGroups = async (releaseZipPath) => {
  const version = path.basename(releaseZipPath);
  const componentGroupMap = await collectComponentGroups(releaseZipPath, version);
  const directiveList = await collectDirectives(releaseZipPath, version);

  return {
    componentGroupMap,
    directiveList,
    customComponentList,
    startList,
  };
};
