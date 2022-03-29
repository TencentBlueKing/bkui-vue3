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

import { TablePropTypes } from './props';

/**
 * 解析Prop值 | 可能为多种类型 & 函数返回的场景
 * @param prop 当前Prop
 * @param key 要处理的Key
 * @param args 如果是函数，传递参数
 * @returns
 */
export const resolvePropVal = (prop: any, key: string, args: any[]) => {
  if (Object.prototype.hasOwnProperty.call(prop, key)) {
    if (typeof prop[key] === 'function') {
      return prop[key].call(this, ...args);
    }

    return prop[key];
  }

  return undefined;
};

/**
 * 处理Props中的ActiveColumn，解析为统一的数组格式
 * @param props
 * @returns
 */
export const resolveActiveColumns = (props: TablePropTypes) => {
  if (props.columnPick !== 'disabled') {
    if (props.columnPick === 'multi') {
      return Array.isArray(props.activeColumn) ? props.activeColumn : resolveNumberToNumArray(props.activeColumn);
    }

    return Array.isArray(props.activeColumn)
      ? resolveNumberToNumArray(props.activeColumn[0])
      : resolveNumberToNumArray(props.activeColumn);
  }
  return [];
};

/**
 * 统一处理数字类型参数
 * @param prop
 * @returns
 */
export const resolveNumberToNumArray = (prop: number) => {
  if (/^\d+$/.test(`${prop}`)) {
    return [parseInt(`${prop}`, 10)];
  }

  return [];
};

/*
 * 解析宽度配置
 * @param propWidth
 * @returns
 */
export const resolveWidth = (propWidth: string | number) => resolveNumberOrStringToPix(propWidth, 'auto');

/**
 * 解析可为数字或者字符串设置的样式配置
 * @param val 配置值
 * @param defaultValue 默认值
 * @param offset 偏移量
 * @returns 标准化px string
 */
export const resolveNumberOrStringToPix = (val: string | number, defaultValue: string | number = '100%', offset = null) => {
  let target: string | number = '';
  if (/^auto|null|undefined$/ig.test(`${val}`)) {
    target = defaultValue;
  } else {
    target = (/^\d+\.?\d+$/.test(`${val}`) ? `${val}px` : val);
  }

  if (offset) {
    target = `calc(${target} - ${offset})`;
  }

  return target;
};
