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

import { throttle } from 'lodash';

import { BORDER_OPRIONS } from './const';
import { Column, GroupColumn, TablePropTypes } from './props';


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

/**
 * 格式化Border配置为标准Class
 * @param val
 * @returns
 */
export const resolvePropBorderToClassStr = (val: string | string[]) => {
  const defaultVal = ['row'];
  if (typeof val === 'string') {
    defaultVal.push(val);
  }

  if (Array.isArray(val)) {
    defaultVal.push(...val.filter((str: string) => BORDER_OPRIONS.includes(str)));
  }

  return [...new Set(defaultVal)].map((item: string) => `bordered-${item}`)
    .join(' ');;
};

/**
 * 根据Props Column配置计算并设置列宽度
 * @param root 当前根元素
 * @param colgroups Columns配置
 * @param autoWidth 自动填充宽度
 */
export const resolveColumnWidth = (root: HTMLElement, colgroups: GroupColumn[], autoWidth = 20) => {
  const { width } = root.getBoundingClientRect() || {};
  // 可用来平均的宽度
  let avgWidth = width - 4;

  // 需要平均宽度的列数
  const avgColIndexList = [];

  /**
   * 根据Props Column配置计算并设置列宽度
   * @param col 当前Column设置
   * @param numWidth 计算宽度
   * @param resetAvgWidth 是否重置可用宽度
   */
  const resolveColNumberWidth = (col: GroupColumn, numWidth: number, resetAvgWidth = true) => {
    Object.assign(col, { calcWidth: numWidth });
    if (resetAvgWidth) {
      avgWidth = avgWidth - numWidth;
      if (avgWidth < 0) {
        avgWidth = 0;
      }
    }
  };

  colgroups.forEach((col: GroupColumn, index: number) => {
    const colWidth = String(col.width);
    let isAutoWidthCol = true;
    if (/^\d+\.?\d*(px)?$/.test(colWidth)) {
      const numWidth = Number(colWidth.replace('px', ''));
      resolveColNumberWidth(col, numWidth);
      isAutoWidthCol = false;
    }

    if (/^\d+\.?\d*%$/.test(colWidth)) {
      let perWidth = autoWidth;
      if (avgWidth > 0) {
        const percent = Number(colWidth.replace('%', ''));
        perWidth = avgWidth * percent / 100;
      }

      resolveColNumberWidth(col, perWidth);
      isAutoWidthCol = false;
    }

    if (isAutoWidthCol) {
      avgColIndexList.push(index);
    }
  });

  // 自适应宽度计算
  if (avgColIndexList.length > 0) {
    let autoAvgWidth = autoWidth;
    if (avgWidth > 0) {
      autoAvgWidth = avgWidth / avgColIndexList.length;
      avgColIndexList.forEach(idx => resolveColNumberWidth(colgroups[idx], autoAvgWidth, false));
    }
  }
};

/**
 * 监听目标元素的Resize事件
 * @param root 目标元素
 * @param callbackFn 执行函数
 * @param delay 延迟执行时间，默认 60
 * @param immediate 是否立即执行回调函数
 * @returns "{ start: () => void, stop: () => void }"
 */
export const observerResize = (
  root: HTMLElement,
  callbackFn: () => void,
  delay = 60,
  immediate = false,
) => {
  const callFn = throttle(() => {
    if (typeof callbackFn === 'function') {
      callbackFn();
    }
  }, delay);
  const resizeObserver = new ResizeObserver(() => {
    callFn();
  });

  if (immediate) {
    if (typeof callbackFn === 'function') {
      callbackFn();
    }
  }
  return {
    start: () => {
      resizeObserver.observe(root);
    },
    stop: () => {
      resizeObserver.disconnect();
      resizeObserver.unobserve(root);
    },
  };
};

/**
 * 判定为数值 | px | %
 * @param val
 * @returns
 */
export const isPercentPixOrNumber = (val: string | number) => /^\d+\.?\d*(px|%)?$/.test(`${val}`);

/**
 * 处理 Prop中的分页配置
 * prop中的配置会覆盖本地的配置
 * @param propPagination 用户传入的配置
 * @param defVal 默认配置
 * @returns 返回值
 */
export const resolvePaginationOption = (propPagination: any, defVal: any) => {
  if (!!propPagination) {
    if (typeof propPagination === 'object') {
      let current = Object.prototype.hasOwnProperty.call(propPagination, 'current')
        ? propPagination.current
        : propPagination.value;
      if (!/\d+/.test(current)) {
        current = 1;
      }

      return { ...defVal, ...propPagination, current };
    }

    return defVal;
  }

  return {};
};

/**
 * Format Table Head Option
 * @param props
 * @returns
 */
export const resolveHeadConfig = (props: TablePropTypes) => {
  const { showHead, headHeight, thead = {} } = props;
  return Object.assign({}, { isShow: showHead, height: headHeight }, { ...thead });
};

/**
   * 获取当前行指定列的内容
   * @param row 当前行
   * @param key 指定列名
   * @param column 列配置
   * @param index 当前行Index
   * @returns
   */
export const getRowText = (row: any, key: string, column: Column) => {
  if (column.type === 'index') {
    return row.__$table_row_index;
  }

  return row[key];
};
