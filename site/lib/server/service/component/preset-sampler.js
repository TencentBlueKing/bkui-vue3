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

// presets 中模拟数据的采样条数：同构记录只需少量样例即可表达完整结构，多余行只会浪费 token
const PRESET_DATA_SAMPLE_SIZE = 2;
// 会被采样的“数据型”字段名（这类数组通常是重复的模拟数据，而 columns 等配置数组必须完整保留）
const SAMPLED_DATA_KEYS = new Set(['data']);

// 判断是否为可采样的同构记录数组（元素都是普通对象，且长度超过采样阈值）
const isSampleableRecordArray = value => Array.isArray(value)
  && value.length > PRESET_DATA_SAMPLE_SIZE
  && value.every(item => item && typeof item === 'object' && !Array.isArray(item));

// 递归裁剪 presets 中的模拟大数据：仅保留少量样例，保证结构完整、体积最小
// 非破坏式：始终返回新对象/数组，避免污染 require 的模块缓存
export const trimMockData = (value) => {
  if (Array.isArray(value)) {
    return value.map(trimMockData);
  }
  if (value && typeof value === 'object') {
    const result = {};
    for (const [key, val] of Object.entries(value)) {
      if (SAMPLED_DATA_KEYS.has(key) && isSampleableRecordArray(val)) {
        result[key] = val.slice(0, PRESET_DATA_SAMPLE_SIZE).map(trimMockData);
      } else {
        result[key] = trimMockData(val);
      }
    }
    return result;
  }
  return value;
};
