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

import debounce from 'lodash/debounce';
import objGet from 'lodash/get';
import throttle from 'lodash/throttle';
import ResizeObserver from 'resize-observer-polyfill';
import { v4 as uuidv4 } from 'uuid';
import { isProxy, toRaw } from 'vue';

import { BORDER_OPTION, BORDER_OPTIONS, SORT_OPTION, TABLE_ROW_ATTRIBUTE } from './const';
import { Column, GroupColumn, ISortPropShape, TablePropTypes } from './props';

/**
 * 解析Prop值 | 可能为多种类型 & 函数返回的场景
 * @param prop 当前Prop
 * @param key 要处理的Key
 * @param args 如果是函数，传递参数
 * @returns
 */
export const resolvePropVal = (prop: any, key: string | string[], args: any[]) => {
  if (prop === undefined || prop === null) {
    return undefined;
  }

  if (typeof key === 'string') {
    if (Object.prototype.hasOwnProperty.call(prop, key)) {
      if (typeof prop[key] === 'function') {
        return prop[key].call(this, ...args);
      }

      return prop[key];
    }

    return undefined;
  }

  if (Array.isArray(key)) {
    return key
      .map((_key: string) => resolvePropVal(prop, _key, args))
      .filter((val: any) => val !== undefined)
      .at(0);
  }
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
export const resolveNumberOrStringToPix = (
  val: string | number,
  defaultValue: string | number = '100%',
  offset = null,
) => {
  let target: string | number = '';
  if (/^auto|null|undefined$/gi.test(`${val}`)) {
    target = defaultValue;
  } else {
    target = /^\d+\.?\d+$/.test(`${val}`) ? `${val}px` : val;
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
    defaultVal.push(...val.filter((str: string) => BORDER_OPTIONS.includes(str as BORDER_OPTION)));
  }

  return [...new Set(defaultVal)].map((item: string) => `bordered-${item}`).join(' ');
};

/**
 * 获取当前列实际宽度
 * width props中设置的默认宽度
 * calcWidth 计算后的宽度
 * resizeWidth 拖拽重置之后的宽度
 * @param colmun 当前列配置
 * @param orders 获取宽度顺序
 * @returns
 */
export const getColumnReactWidth = (colmun: GroupColumn, orders = ['resizeWidth', 'calcWidth', 'width']) =>
  colmun[orders[0]] ?? colmun[orders[1]] ?? colmun[orders[2]];

/**
 * 监听目标元素的Resize事件
 * @param root 目标元素
 * @param callbackFn 执行函数
 * @param delay 延迟执行时间，默认 60
 * @param immediate 是否立即执行回调函数
 * @param resizerWay 执行方式：debounce | throttle
 * @returns "{ start: () => void, stop: () => void }"
 */
export const observerResize = (
  root: HTMLElement,
  callbackFn: () => void,
  delay = 60,
  immediate = false,
  resizerWay = 'throttle',
) => {
  // 设置判定，避免因计算导致的resize死循环
  const resolveCallbackFn = () => {
    if (typeof callbackFn === 'function') {
      callbackFn();
    }
  };
  const execFn = resizerWay === 'debounce' ? debounce(resolveCallbackFn, delay) : throttle(resolveCallbackFn, delay);
  const callFn = () => Reflect.apply(execFn, this, []);

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
    disconnect: () => {
      resizeObserver.unobserve(root);
      resizeObserver.disconnect();
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
 * Format Table Head Option
 * @param props
 * @returns
 */
export const resolveHeadConfig = (props: TablePropTypes) => {
  const { showHead, headHeight, thead = {} } = props;
  return Object.assign({}, { isShow: showHead, height: headHeight }, thead);
};

const getRegExp = (val: string | number | boolean, flags = 'ig') =>
  new RegExp(`${val}`.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), flags);

/**
 * 获取当前行指定列的内容
 * @param row 当前行
 * @param key 指定列名
 * @param column 列配置
 * @param index 当前行Index
 * @returns
 */
export const getRowText = (row: any, key: string, format?: string[] | (() => string | number | boolean)[]) => {
  let result;
  if (typeof row === 'string' || typeof row === 'number' || typeof row === 'boolean') {
    result = row;
  }

  if (typeof row === 'object') {
    result = objGet(row, key);
  }

  if (format?.length) {
    format.forEach(reg => {
      if (typeof reg === 'function') {
        result = reg(result, row, key);
      } else if (typeof result === 'string') {
        const matches = result.match(typeof reg === 'string' ? getRegExp(reg) : reg);
        result = matches?.[1] ?? result;
      }
    });

    if (/^-?\d+.?\d*$/.test(result)) {
      result = Number(result);
    }
  }

  return result;
};

/**
 * 获取当前行指定列的值
 * @param row 当前行
 * @param key 指定列名
 * @returns
 */
export const getRowValue = (row: any, key: string) => {
  return objGet(row, key);
};

/**
 * 格式化prop配置为标准数组格式
 * @param prop prop对象值
 * @param args 如果是function参数
 * @returns
 */
export const formatPropAsArray = (prop: string | object | (() => any), args: any[]) => {
  if (Array.isArray(prop)) {
    return prop;
  }

  if (typeof prop === 'string' || typeof prop === 'object') {
    return [prop];
  }

  if (typeof prop === 'function') {
    return formatPropAsArray(Reflect.apply(prop, this, args), args);
  }

  return [];
};

export const isRenderScrollBottomLoading = (props: TablePropTypes) => {
  if (props.scrollLoading === null) {
    return false;
  }

  return typeof props.scrollLoading === 'boolean' || typeof props.scrollLoading === 'object';
};

export const getRowKey = (item: any, props: TablePropTypes, index: number) => {
  const val = getRowKeyNull(item, props, index);
  if (val !== null) {
    return val;
  }

  return uuidv4();
};

export const getRowKeyNull = (item: any, props: TablePropTypes, index: number) => {
  if (typeof props.rowKey === 'string') {
    if (props.rowKey === TABLE_ROW_ATTRIBUTE.ROW_INDEX) {
      return `__ROW_INDEX_${index}`;
    }

    return objGet(item, props.rowKey);
  }

  if (typeof props.rowKey === 'function') {
    return Reflect.apply(props.rowKey, this, [item]);
  }

  return null;
};

export const hasRootScrollY = (root, querySelector: string, offsetHeight = 0) => {
  if (root) {
    const tableBody = root.querySelector(querySelector) as HTMLElement;
    if (tableBody) {
      return tableBody.offsetHeight > root.offsetHeight - offsetHeight;
    }
  }

  return false;
};

export const getColumnClass = (column: Column, colIndex = 0, uuid: string = null) => ({
  ...(uuid ? { [`${uuid}-column-${colIndex}`]: true } : {}),
  column_fixed: !!column.fixed,
  column_fixed_left: !!column.fixed,
  column_fixed_right: column.fixed === 'right',
});

export const getElementTextWidth = (element: HTMLElement, text?: string) => {
  /**
   * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
   *
   * @param {String} text The text to be rendered.
   * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
   *
   * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
   */
  function getTextWidth(text, font) {
    // re-use canvas object for better performance
    const canvas = (getTextWidth as any).canvas || ((getTextWidth as any).canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }

  function getCssStyle(element, prop) {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
  }

  function getCanvasFont(el = document.body) {
    const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
    const fontSize = getCssStyle(el, 'font-size') || '16px';
    const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';

    return `${fontWeight} ${fontSize} ${fontFamily}`;
  }

  return getTextWidth(text || element?.innerHTML, getCanvasFont(element));
};

export const isColumnHidden = (settingFields, column, checked) => {
  const getFieldValue = field => field.field ?? field.id;
  const isSettingField = (col: Column) =>
    settingFields.some(field => getFieldValue(field) === resolvePropVal(col, ['field', 'type'], [col]));
  return (
    isSettingField(column) && checked.length && !checked.includes(resolvePropVal(column, ['field', 'type'], [column]))
  );
};

export const resolveColumnSpan = (column: Column, colIndex: number, row: any, rowIndex: number, key: string) => {
  if (typeof column[key] === 'function') {
    return Reflect.apply(column[key], this, [{ column, colIndex, row, rowIndex }]);
  }

  if (typeof column[key] === 'number') {
    return column[key];
  }

  return 1;
};

export const resolveCellSpan = (column: Column, colIndex: number, row: any, rowIndex: number) => {
  const colspan = resolveColumnSpan(column, colIndex, row, rowIndex, 'colspan');
  const rowspan = resolveColumnSpan(column, colIndex, row, rowIndex, 'rowspan');
  return { colspan, rowspan };
};

export const skipThisColumn = (columns: Column[], colIndex: number, row: any, rowIndex: number) => {
  let skip = false;

  for (let i = colIndex; i > 0; i--) {
    const colspan = resolveColumnSpan(columns[i], i, row, rowIndex, 'colspan');
    if (colspan > 1) {
      skip = colspan - 1 + i >= colIndex;
      break;
    }
  }
  return skip;
};

export const getSortFn = (column, sortType, format = []) => {
  const fieldName = column.field as string;
  const getVal = (row: any) => getRowText(row, fieldName, format);
  const sortFn0 = (a: any, b: any) => {
    const val0 = getVal(a) ?? '';
    const val1 = getVal(b) ?? '';
    if (typeof val0 === 'number' && typeof val1 === 'number') {
      return val0 - val1;
    }

    return String.prototype.localeCompare.call(val0, val1);
  };

  const sortFn = typeof (column.sort as any)?.sortFn === 'function' ? (column.sort as any)?.sortFn : sortFn0;

  return sortType === SORT_OPTION.NULL
    ? (_a, _b) => true
    : (_a, _b) => sortFn(_a, _b) * (sortType === SORT_OPTION.DESC ? -1 : 1);
};

export const getNextSortType = (sortType: string) => {
  const steps = {
    [SORT_OPTION.NULL]: 3,
    [SORT_OPTION.ASC]: 1,
    [SORT_OPTION.DESC]: 2,
  };

  if (steps[sortType] === undefined) {
    return SORT_OPTION.ASC;
  }

  return Object.keys(steps)[(steps[sortType] + 1) % 3];
};

export const resolveSort = (sort: ISortPropShape, column, format = []) => {
  if (typeof sort === 'string') {
    return {
      value: sort,
    };
  }

  if (typeof sort === 'boolean' && sort) {
    return {
      value: SORT_OPTION.NULL,
    };
  }

  if (typeof sort === 'object' && sort !== null) {
    if (typeof sort.sortFn === 'function') {
      return {
        value: 'custom',
        ...sort,
      };
    }

    return Object.assign({}, { sortFn: getSortFn(column, sort.value ?? SORT_OPTION.NULL, format) }, sort);
  }

  return null;
};

export const isRowSelectEnable = (
  props,
  { row, index, isCheckAll }: { row: any; index?: number; isCheckAll?: boolean },
) => {
  if (typeof props.isRowSelectEnable === 'boolean') {
    return props.isRowSelectEnable !== false;
  }

  if (typeof props.isRowSelectEnable === 'function') {
    return props.isRowSelectEnable({ row, index, isCheckAll });
  }

  return true;
};

export const getRowId = (row, defVal, props) => {
  const key = getRowKey(row, props, defVal);
  if (key !== undefined && row[key] !== undefined) {
    return row[key];
  }

  return defVal;
};

export const resolveColumnSortProp = (col: Column, props: TablePropTypes) => {
  const { value, sortFn, sortScope } = resolveSort(col.sort ?? props.defaultSort, col) ?? {};
  return {
    type: value,
    fn: sortFn,
    scope: sortScope,
    active: !!col.sort,
  };
};

export const getRawData = data => {
  if (isProxy(data)) {
    return toRaw(data);
  }

  return data;
};
