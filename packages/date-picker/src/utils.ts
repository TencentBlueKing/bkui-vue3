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

import { format as dateFnsFormat, toDate } from 'date-fns';
import type { InjectionKey } from 'vue';

import { resolveClassName } from '@bkui-vue/shared';

import fecha from './fecha';
import type { IDatePickerCtx, ITimePickerCtx, PickerTypeType } from './interface';

export const RANGE_SEPARATOR = ' - ';

// export const toDate = (date) => {
//   let _date: any = new Date(date);
//   // IE patch start (#1422)
//   if (isNaN(_date.getTime()) && typeof date === 'string') {
//     _date = date.split('-').map(Number);
//     _date[1] += 1;
//     _date = new Date(..._date);
//   }
//   // IE patch end

//   if (isNaN(_date.getTime())) {
//     return null;
//   }
//   return _date;
// };

// export const formatDate = (date, format) => {
//   date = toDate(date);
//   if (!date) {
//     return '';
//   }
//   return fecha.format(date, format || 'yyyy-MM-dd');
// };

const dateFormat = (_date, format) => {
  const date = toDate(new Date(_date));
  if (!date || isNaN(date.getTime())) {
    return '';
  }
  return dateFnsFormat(date, format || 'yyyy-MM-dd');
};

const rangeFormatter = (value, format) => {
  if (Array.isArray(value) && value.length === 2) {
    const start = value[0];
    const end = value[1];

    if (start && end) {
      return dateFormat(start, format) + RANGE_SEPARATOR + dateFormat(end, format);
    }
  } else if (!Array.isArray(value) && value instanceof Date) {
    return dateFormat(value, format);
  }
  return '';
};

const rangeParser = (text, format) => {
  const array = Array.isArray(text) ? text : text.split(RANGE_SEPARATOR);
  if (array.length === 2) {
    const range1 = array[0];
    const range2 = array[1];

    return [
      range1 instanceof Date ? range1 : fecha.parse(range1, format || 'yyyy-MM-dd'),
      range2 instanceof Date ? range2 : fecha.parse(range2, format || 'yyyy-MM-dd'),
    ];
  }

  return [];
};

export const typeValueResolver = {
  default: {
    formatter(value) {
      if (!value) {
        return '';
      }
      return `${value}`;
    },
    parser(text) {
      if (text === undefined || text === '') {
        return null;
      }
      return text;
    },
  },
  date: {
    formatter: (value, format) => dateFormat(value, format),
    parser: (text, format) => fecha.parse(text, format || 'yyyy-MM-dd'),
  },
  datetime: {
    formatter: (value, format) => dateFormat(value, format),
    parser: (text, format) => fecha.parse(text, format || 'yyyy-MM-dd'),
  },
  daterange: {
    formatter: rangeFormatter,
    parser: rangeParser,
  },
  datetimerange: {
    formatter: rangeFormatter,
    parser: rangeParser,
  },
  timerange: {
    formatter: rangeFormatter,
    parser: rangeParser,
  },
  time: {
    formatter: (value, format) => dateFormat(value, format),
    parser: (text, format) => fecha.parse(text, format || 'yyyy-MM-dd'),
  },
  month: {
    formatter: (value, format) => dateFormat(value, format),
    parser: (text, format) => fecha.parse(text, format || 'yyyy-MM-dd'),
  },
  year: {
    formatter: (value, format) => dateFormat(value, format),
    parser: (text, format) => fecha.parse(text, format || 'yyyy-MM-dd'),
  },
  multiple: {
    formatter(value, format) {
      return value.filter(Boolean).map(date => dateFormat(date, format))
        .join(',');
    },
    parser(v, format) {
      const values = typeof v === 'string' ? v.split(',') : v;
      return values.map((value) => {
        if (value instanceof Date) {
          return value;
        }

        let val = value;

        if (typeof value === 'string') {
          val = value.trim();
        } else if (typeof value !== 'number' && !value) {
          val = '';
        }

        return fecha.parse(val, format || 'yyyy-MM-dd');
      });
    },
  },
  number: {
    formatter(value) {
      if (!value) {
        return '';
      }
      return `${value}`;
    },
    parser(text) {
      const result = Number(text);

      if (!isNaN(text)) {
        return result;
      }

      return null;
    },
  },
};

/**
 * 设置时间，当天的零点时间
 *
 * @return {Date} date 对象
 */
export const initTime = () => {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return date;
};

/**
 * 判断数组中的每个值是否为空
 * 0, '', null, undefined 均判断为空
 *
 * @param {Array} arr 待判断的数组
 *
 * @return {boolean} 判断结果
 */
export const isAllEmptyArr = (arr: any[]): boolean => arr.every(item => !item || (typeof item === 'string' && item.trim() === ''));

export const keyValueMapper = {
  40: 'up',
  39: 'right',
  38: 'down',
  37: 'left',
};

export const mapPossibleValues = (key: string, horizontal: number, vertical: number): number => {
  if (key === 'left') {
    return horizontal * -1;
  }
  if (key === 'right') {
    return horizontal * 1;
  }
  if (key === 'up') {
    return vertical * 1;
  }
  if (key === 'down') {
    return vertical * -1;
  }
};

export const extractTime = (date: Date) => {
  if (!date) {
    return [0, 0, 0];
  }
  return [
    date.getHours(), date.getMinutes(), date.getSeconds(),
  ];
};

export const DEFAULT_FORMATS: Record<PickerTypeType, string> = {
  date: 'yyyy-MM-dd',
  month: 'yyyy-MM',
  year: 'yyyy',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  time: 'HH:mm:ss',
  timerange: 'HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  datetimerange: 'yyyy-MM-dd HH:mm:ss',
};

export const parseDate = (val, type, multiple, format) => {
  const isRange = type.includes('range');
  const { parser } = typeValueResolver[type] || typeValueResolver.default;
  const f = format || DEFAULT_FORMATS[type];
  const multipleParser = typeValueResolver.multiple.parser;

  let value = val;

  if (val && type === 'time' && !(val instanceof Date)) {
    value = parser(val, f);
  } else if (multiple && val) {
    value = multipleParser(val, f);
  } else if (isRange) {
    if (!val) {
      value = [null, null];
    } else {
      if (typeof val === 'string') {
        value = parser(val, f);
      } else if (type === 'timerange') {
        value = parser(val, f).map(v => v || '');
      } else {
        const [start, end] = val;
        if (start instanceof Date && end instanceof Date) {
          value = val.map(date => new Date(date));
        } else if (typeof start === 'string' && typeof end === 'string') {
          value = parser(val.join(RANGE_SEPARATOR), f);
        } else if (!start || !end) {
          value = [null, null];
        }
      }
    }
  } else if (typeof val === 'string' && type.indexOf('time') !== 0) {
    value = parser(val, f) || null;
  }

  return (isRange || multiple) ? (value || []) : [value];
};

export const formatDate = (val, type, multiple, format) => {
  const f = DEFAULT_FORMATS[type];

  if (multiple) {
    const { formatter } = typeValueResolver.multiple;
    return formatter(val, format || f);
  }
  const { formatter } = (typeValueResolver[type] || typeValueResolver.default);
  return formatter(val, format || f);
};

export const datePickerKey: InjectionKey<IDatePickerCtx> = Symbol('date-picker');
export const timePickerKey: InjectionKey<ITimePickerCtx> = Symbol('time-picker');

/**
 * 寻找子组件
 *
 * @param {Object} context 上下文
 * @param {string} componentName 要找的组件类型名称
 *
 * @return {Array} 组件集合
 */
// export function findChildComponents(context, componentName) {
//   return (context.$children || []).reduce((components, child) => {
//     if (child.$options.name === componentName) {
//       components.push(child);
//     }
//     const foundChilds = findChildComponents(child, componentName);
//     return components.concat(foundChilds);
//   }, []);
// }

export function iconBtnCls(direction, type = '') {
  return [
    resolveClassName('picker-panel-icon-btn'),
    resolveClassName(`date-picker-${direction}-btn`),
    resolveClassName(`date-picker-${direction}-btn-arrow${type}`),
  ];
}

export const getDayCountOfMonth = (year, month) => new Date(year, month + 1, 0).getDate();

export const siblingMonth = (src, diff) => {
  // lets copy it so we don't change the original
  const temp = new Date(src);
  const newMonth = temp.getMonth() + diff;
  const newMonthDayCount = getDayCountOfMonth(temp.getFullYear(), newMonth);
  if (newMonthDayCount < temp.getDate()) {
    temp.setDate(newMonthDayCount);
  }
  temp.setMonth(newMonth);

  return temp;
};

export const formatDateLabels = (() => {
  /*
    Formats:
    yyyy - 4 digit year
    m - month, numeric, 1 - 12
    mm - month, numeric, 01 - 12
    mmm - month, 3 letters, as in `toLocaleDateString`
    Mmm - month, 3 letters, capitalize the return from `toLocaleDateString`
    mmmm - month, full name, as in `toLocaleDateString`
    Mmmm - month, full name, capitalize the return from `toLocaleDateString`
  */
  const formats = {
    yyyy: date => date.getFullYear(),
    m: date => date.getMonth() + 1,
    mm: date => (`0${date.getMonth() + 1}`).slice(-2),
    mmm: (date, locale) => {
      const monthName = date.toLocaleDateString(locale, {
        month: 'long',
      });
      return monthName.slice(0, 3);
    },
    Mmm: (date, locale) => {
      const monthName = date.toLocaleDateString(locale, {
        month: 'long',
      });
      return (monthName[0].toUpperCase() + monthName.slice(1).toLowerCase()).slice(0, 3);
    },
    mmmm: (date, locale) => date.toLocaleDateString(locale, {
      month: 'long',
    }),
    Mmmm: (date, locale) => {
      const monthName = date.toLocaleDateString(locale, {
        month: 'long',
      });
      return monthName[0].toUpperCase() + monthName.slice(1).toLowerCase();
    },
  };
  const formatRegex = new RegExp(['yyyy', 'Mmmm', 'mmmm', 'Mmm', 'mmm', 'mm', 'm'].join('|'), 'g');

  return (locale, format, date) => {
    const componetsRegex = /(\[[^\]]+\])([^\\[\]]+)(\[[^\]]+\])/;
    const components = format.match(componetsRegex).slice(1);
    const separator = components[1];
    const labels = [components[0], components[2]].map((component) => {
      const label = component.replace(/\[[^\]]+\]/, str => str.slice(1, -1).replace(formatRegex, match => formats[match](date, locale)));
      return {
        label,
        type: component.indexOf('yy') !== -1 ? 'year' : 'month',
      };
    });
    return {
      separator,
      labels,
    };
  };
})();


export const clearHours = (time) => {
  const cloneDate = new Date(time);
  cloneDate.setHours(0, 0, 0, 0);
  return cloneDate.getTime();
};

export const isInRange = (time, a, b) => {
  if (!a || !b) {
    return false;
  }
  const [start, end] = [a, b].sort();
  return time >= start && time <= end;
};

/**
 * firstUpperCase
 *
 * @param {string} str str
 *
 * @return {string} str
 */
export function firstUpperCase(str) {
  return str.toString()[0].toUpperCase() + str.toString().slice(1);
}

/**
 * 根据 date 设置 h, m, s
 *
 * @param {Date} date date 对象
 * @param {number} h 小时数
 * @param {number} m 分钟数
 * @param {number} s 秒数
 *
 * @return {Date} date 对象
 */
export const mergeDateHMS = (date, ...hms) => {
  const newDate = new Date(date.getTime());
  newDate.setHours(hms[0]);
  newDate.setMinutes(hms[1]);
  newDate.setSeconds(hms[2]);
  return newDate;
};

export const capitalize = str => str[0].toUpperCase() + str.slice(1);
