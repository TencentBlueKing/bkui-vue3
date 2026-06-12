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

import { trimMockData } from './preset-sampler';

// 获取组件信息（含 props/emits/slots/types/presets 等），并对 presets 中的模拟数据做采样
export const getComponentInfo = async (releaseZipPath, componentName) => {
  const directiveList = fs.readdirSync(path.resolve(releaseZipPath, 'directives/demo'));
  const componentDemoPath = directiveList.find(item => item.includes(componentName))
    ? path.resolve(releaseZipPath, 'directives/demo', `${componentName}.ts.js`)
    : path.resolve(releaseZipPath, componentName, 'demo/index.ts.js');

  if (!fs.existsSync(componentDemoPath)) {
    return {
      error: '组件不存在',
    };
  }

  const componentInfo = require(componentDemoPath).default;
  // 仅对 presets 做模拟数据采样，props/emits/slots/types 等 API 定义保持完整
  if (Array.isArray(componentInfo?.presets)) {
    return {
      ...componentInfo,
      presets: componentInfo.presets.map(trimMockData),
    };
  }
  return componentInfo;
};
