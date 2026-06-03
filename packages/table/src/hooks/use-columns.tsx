/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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
import { computed, isRef, reactive, ref, toRaw } from 'vue';

import { useLocale } from '@bkui-vue/config-provider';
import debounce from 'lodash/debounce';
import { v4 as uuidv4 } from 'uuid';

import { AUTO_WIDTH_VALUES, COL_MIN_WIDTH, COLUMN_ATTRIBUTE, IEmptyObject } from '../const';
import { Column, IColSortBehavior, IFilterShape, IHeadGroup, Settings, TablePropTypes } from '../props';
import {
  getRowText,
  isColumnHidden,
  resolveColumnFilterProp,
  resolveColumnSortProp,
  resolveColumnSpan,
  resolveActiveColumns,
  resolvePropVal,
} from '../utils';

const useColumns = (props: TablePropTypes) => {
  const t = useLocale('table');
  const tableColumnSchema = reactive(new WeakMap());
  const tableColumnList = reactive([]);
  const uuid = uuidv4();
  const sortColumns = reactive([]);
  const filterColumns = reactive([]);
  const columnGroup: Column[][] = reactive([]);
  const columnGroupMap = new WeakMap<Column, IHeadGroup>();

  // 版本号机制：用于追踪排序和过滤状态变化，避免深度监听
  const sortVersion = ref(0);
  const filterVersion = ref(0);
  const columnsVersion = ref(0);

  /**
   * 用来记录列的排序状态
   * @param col
   * @param sortOption
   * @returns
   */
  const setSortColumns = (col: Column, sortOption = {}) => {
    sortColumns.forEach(item => (item.active = false));
    const target = sortColumns.find(item => item.col === col);
    if (target) {
      Object.assign(target, sortOption, { active: true });
    } else {
      sortColumns.push({ col, ...sortOption, active: true });
    }
    // 更新版本号，触发依赖更新
    sortVersion.value++;
  };

  const setColumnCalcWidth = (col: Column, attrName: string, width: number) => {
    let colWidth = 0;
    if (/^\d+\.?\d*(px)?$/.test(`${col[attrName]}`)) {
      colWidth = Number(`${col[attrName]}`.replace(/px/, ''));
      // 计算宽度统一落到 calcWidth，避免覆盖用户拖拽的 resizeWidth
      setColumnAttribute(col, COLUMN_ATTRIBUTE.CALC_WIDTH, colWidth);
      setColumnRect(col, {
        width: colWidth,
        left: null,
        right: null,
      });
    }

    if (/^\d+\.?\d*%$/.test(`${col[attrName]}`)) {
      colWidth = (Number(`${col[attrName]}`.replace(/%/, '')) / 100) * width;
      setColumnAttribute(col, COLUMN_ATTRIBUTE.CALC_WIDTH, colWidth);
      setColumnRect(col, {
        width: colWidth,
        left: null,
        right: null,
      });
    }

    return colWidth;
  };

  /**
   * 根据表格外层宽度和表格列配置
   * 计算每一列的宽度
   * @param width
   */
  const resolveColsCalcWidth = (width: number) => {
    let diffWidth = width;
    let minColWidth = COL_MIN_WIDTH;

    const resolveColWidth = (colList: Column[], attrName = 'width') => {
      const filterList: Column[] = [];
      colList.forEach(col => {
        const calcWidth = setColumnCalcWidth(col, attrName, width);
        diffWidth = diffWidth - calcWidth;

        if (AUTO_WIDTH_VALUES.includes(col[attrName] as string)) {
          filterList.push(col);
        }
      });

      if (diffWidth > 0 && filterList.length) {
        minColWidth = diffWidth / filterList.length;
      }

      return filterList;
    };

    const minWidthList = resolveColWidth(visibleColumns);
    const autoWidthList = resolveColWidth(minWidthList, 'minWidth');

    visibleColumns.forEach(col => {
      if (autoWidthList.includes(col)) return;
      const calcWidth = (getColumnAttribute(col, COLUMN_ATTRIBUTE.CALC_WIDTH) as number) || 0;
      const resolvedMinWidth = (getColumnAttribute(col, COLUMN_ATTRIBUTE.COL_MIN_WIDTH) as number) || COL_MIN_WIDTH;
      if (calcWidth > 0 && calcWidth < resolvedMinWidth) {
        setColumnAttribute(col, COLUMN_ATTRIBUTE.CALC_WIDTH, resolvedMinWidth);
        setColumnRect(col, { width: resolvedMinWidth, left: null, right: null });
        diffWidth -= resolvedMinWidth - calcWidth;
      }
    });

    if (autoWidthList.length > 0) {
      minColWidth = diffWidth > 0 ? diffWidth / autoWidthList.length : COL_MIN_WIDTH;
    }

    autoWidthList.forEach(col => {
      const colMinWidth = (getColumnAttribute(col, COLUMN_ATTRIBUTE.COL_MIN_WIDTH) as number) || COL_MIN_WIDTH;
      const calcWidth = minColWidth > colMinWidth ? minColWidth : colMinWidth;
      setColumnAttribute(col, COLUMN_ATTRIBUTE.CALC_WIDTH, calcWidth);
      setColumnRect(col, {
        width: calcWidth,
        left: null,
        right: null,
      });
    });
  };

  /**
   * 用来记录列的过滤状态
   * @param col
   * @param filterOption
   * @returns
   */
  const setFilterColumns = (col: Column, filterOption = {}) => {
    const target = filterColumns.find(item => item.col === col);
    if (target) {
      Object.assign(target, filterOption);
    } else {
      filterColumns.push({ col, ...filterOption });
    }
    // 更新版本号，触发依赖更新
    filterVersion.value++;
  };

  const visibleColumns: Column[] = reactive([]);
  const setVisibleColumns = () => {
    visibleColumns.length = 0;
    visibleColumns.push(...tableColumnList.filter(col => !isHiddenColumn(col)));
    // 更新版本号，触发依赖更新
    columnsVersion.value++;
  };

  const resolveDraggableColumn = () => {
    if (props.rowDraggable) {
      return {
        minWidth: 50,
        width: props.rowDraggable?.width ?? 60,
        label: props.rowDraggable?.label ?? t.value.sort,
        type: 'drag',
      };
    }

    return null;
  };

  /**
   * 判定是否需要合并行或者列配置
   */
  const neepColspanOrRowspan = (attrs = ['rowspan', 'colspan']) =>
    tableColumnList.some(col => attrs.some(name => typeof col[name] === 'function' || /^\d$/.test(`${col[name]}`)));

  const needColSpan = computed(() => neepColspanOrRowspan(['colspan']));
  const needRowSpan = computed(() => neepColspanOrRowspan(['rowspan']));

  const getColumnSpanConfig = (col: Column, index: number, skipColNum: number) => {
    let skipColumnNum = skipColNum;
    const colspan = resolveColumnSpan(col, index, null, null, 'colspan');
    const target = {
      skipCol: false,
      skipColLen: 0,
    };

    if (skipColumnNum > 0) {
      target.skipColLen = skipColumnNum;
      target.skipCol = true;
      skipColumnNum = skipColumnNum - 1;
    }

    if (colspan > 1) {
      target.skipColLen = colspan;
      skipColumnNum = colspan - 1;
    }

    return { ...target, skipColumnNum };
  };

  const resolveMinWidth = (col: Column) => {
    if (/^\d+/.test(`${col.minWidth}`)) {
      return col.minWidth;
    }

    let minWidth = COL_MIN_WIDTH;
    if (col.sort) {
      minWidth = minWidth + 18;
    }

    if (col.filter) {
      minWidth = minWidth + 28;
    }
    return minWidth;
  };

  const resolveEventListener = (col: Column, index: number) => {
    const listeners = getColumnAttribute(col, COLUMN_ATTRIBUTE.LISTENERS) as Map<string, ((...args) => void)[]>;

    if (!listeners) {
      return {};
    }

    return Array.from(listeners?.keys()).reduce((handle: Record<string, (...args) => void>, key: string) => {
      const eventName = key.split('_').slice(-1)[0];
      return Object.assign(handle, {
        [eventName]: (e: MouseEvent) => {
          listeners.get(key).forEach(fn => Reflect.apply(fn, this, [e, col, index]));
        },
      });
    }, {});
  };

  const resolveFilterFn = (col: Column) => {
    if (!col.filter) {
      return null;
    }

    const getRegExp = (val: boolean | number | string, flags = 'ig') =>
      new RegExp(`${val}`.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), flags);

    const defaultFilterFn = (checked: string[], row: Record<string, object>) => {
      const { match } = col.filter as IFilterShape;
      const matchText = getRowText(row, resolvePropVal(col, 'field', [col, row]));
      if (match !== 'fuzzy') {
        return checked.includes(matchText);
      }

      return checked.some((str: string) => getRegExp(str, 'img').test(matchText));
    };

    const filterFn =
      typeof (col.filter as IFilterShape).filterFn === 'function'
        ? (checked: string[], row: Record<string, object>, index: number, data: Record<string, object>[]) =>
            (col.filter as IFilterShape).filterFn(checked, row, col, index, data)
        : (checked: string[], row: Record<string, object>) => (checked.length ? defaultFilterFn(checked, row) : true);

    return filterFn;
  };

  /**
   * 格式化Column嵌套配置，支持多表头设置
   * @param cols
   */
  const flatColumnTemplate = (cols: Column[]) => {
    columnGroup.length = 0;
    let maxDepth = 0;
    const targetColumns = [];

    const dragColumn = resolveDraggableColumn();
    if (dragColumn) {
      cols.unshift(dragColumn);
    }

    const getMaxDepth = (root: Column[], depth = 1) => {
      if (root.length && maxDepth < depth) {
        maxDepth = depth;
      }

      root.forEach(col => getMaxDepth(col.children ?? [], depth + 1));
    };

    getMaxDepth(cols);

    const updateParentThColspan = (col: Column, count: number) => {
      if (col) {
        const colMap = columnGroupMap.get(col);
        colMap.thColspan = colMap.thColspan + count;
        colMap.offsetLeft = colMap.offsetLeft + count;
        updateParentThColspan(colMap.parent, count);
      }
    };

    const foreachAllColumns = (column: Column, depth: number, parent?: Column, left?: number) => {
      const col = toRaw(column);
      let leftColumnCount = left;
      if (columnGroup[depth] === undefined) {
        columnGroup[depth] = [];
      }

      const isGroup = !!(col.children?.length ?? false);
      if (!(col.children?.length ?? false)) {
        targetColumns.push(col);
      }

      if (!columnGroupMap.has(col)) {
        columnGroupMap.set(col, { thColspan: 1, thRowspan: 1, isGroup, offsetLeft: left });
      }

      const colMap = columnGroupMap.get(col);

      const childLength = col.children?.length ?? 0;
      const thColspan = col.children?.length ?? 1;
      const thRowspan = childLength > 0 ? 1 : maxDepth - depth;
      const offsetLeft = leftColumnCount + (childLength > 0 ? childLength - 1 : 0);

      Object.assign(colMap, { thColspan: thColspan > 0 ? thColspan : 1, parent, thRowspan, offsetLeft });
      columnGroup[depth].push(col);

      if (thColspan > 1) {
        updateParentThColspan(parent, thColspan - 1);
      }

      col.children?.forEach((c, index) => {
        leftColumnCount = leftColumnCount + foreachAllColumns(c, depth + 1, col, leftColumnCount + index);
      });
      return childLength > 0 ? childLength - 1 : 0;
    };

    let leftColumnCount = 0;
    cols.forEach((col, index) => {
      leftColumnCount = leftColumnCount + foreachAllColumns(col, 0, null, leftColumnCount + index);
    });

    return targetColumns;
  };

  const getGroupAttribute = (group: Column) => columnGroupMap.get(group);

  /**
   * 初始化列的过滤和排序配置
   * @param col 列配置
   */
  const initColumnFilterSort = (col: Column) => {
    const { type, fn, scope, active, enabled } = resolveColumnSortProp(col, props);
    const filterFn = resolveFilterFn(col);
    const filterObj = resolveColumnFilterProp(col);

    if (filterObj.enabled) {
      setFilterColumns(col, {
        [COLUMN_ATTRIBUTE.COL_FILTER_FN]: filterFn,
        [COLUMN_ATTRIBUTE.COL_FILTER_VALUES]: filterObj.checked ?? [],
      });
    }

    if (enabled) {
      setSortColumns(col, {
        [COLUMN_ATTRIBUTE.COL_SORT_TYPE]: type,
        [COLUMN_ATTRIBUTE.COL_SORT_FN]: fn,
        [COLUMN_ATTRIBUTE.COL_SORT_SCOPE]: scope,
      });
    }

    return { type, fn, scope, active, filterFn, filterObj };
  };

  /**
   * 创建列的初始 schema
   * @param col 列配置
   * @param sortFilterConfig 排序过滤配置
   * @param spanConfig span 配置
   */
  const createColumnSchema = (
    col: Column,
    sortFilterConfig: {
      type: string;
      fn: unknown;
      scope: unknown;
      active: boolean;
      filterFn: unknown;
      filterObj: unknown;
    },
    spanConfig: { skipCol: boolean; skipColumnNum: number; skipColLen: number },
  ) => {
    const { type, fn, scope, active, filterFn, filterObj } = sortFilterConfig;
    const { skipCol, skipColumnNum, skipColLen } = spanConfig;
    const settings = (props.settings ?? {}) as Settings;

    return {
      [COLUMN_ATTRIBUTE.CALC_WIDTH]: undefined,
      [COLUMN_ATTRIBUTE.RESIZE_WIDTH]: undefined,
      [COLUMN_ATTRIBUTE.COL_RECT]: reactive({
        width: null,
        left: null,
        right: null,
        height: null,
      }),
      [COLUMN_ATTRIBUTE.COL_MIN_WIDTH]: resolveMinWidth(col),
      [COLUMN_ATTRIBUTE.LISTENERS]: new Map(),
      [COLUMN_ATTRIBUTE.WIDTH]: col.width,
      [COLUMN_ATTRIBUTE.IS_HIDDEN]: isColumnHidden(settings.fields ?? [], col, settings.checked ?? []),
      [COLUMN_ATTRIBUTE.COL_SORT_TYPE]: ref(type),
      [COLUMN_ATTRIBUTE.COL_SORT_FN]: fn,
      [COLUMN_ATTRIBUTE.COL_FILTER_OBJ]: filterObj,
      [COLUMN_ATTRIBUTE.COL_FILTER_FN]: filterFn,
      [COLUMN_ATTRIBUTE.COL_FILTER_SCOPE]: undefined,
      [COLUMN_ATTRIBUTE.COL_SORT_SCOPE]: scope,
      [COLUMN_ATTRIBUTE.COL_SORT_ACTIVE]: ref(active),
      [COLUMN_ATTRIBUTE.COL_IS_DRAG]: false,
      [COLUMN_ATTRIBUTE.COL_SPAN]: { skipCol, skipColumnNum, skipColLen },
      [COLUMN_ATTRIBUTE.COL_UID]: uuidv4(),
      [COLUMN_ATTRIBUTE.SELECTION_DISABLED]: false,
      [COLUMN_ATTRIBUTE.SELECTION_INDETERMINATE]: false,
      [COLUMN_ATTRIBUTE.SELECTION_VAL]: false,
      [COLUMN_ATTRIBUTE.COL_RESIZEABLE]: col.resizable !== false,
      [COLUMN_ATTRIBUTE.COL_FIXED_STYLE]: reactive({}),
    };
  };

  /**
   * 更新列的 span 配置
   * @param col 列配置
   * @param spanConfig span 配置
   */
  const updateColumnSpanConfig = (
    col: Column,
    spanConfig: { skipCol: boolean; skipColumnNum: number; skipColLen: number },
  ) => {
    Object.assign(tableColumnSchema.get(col), {
      [COLUMN_ATTRIBUTE.COL_SPAN]: spanConfig,
      [COLUMN_ATTRIBUTE.COL_MIN_WIDTH]: resolveMinWidth(col),
    });
  };

  /**
   * 格式化列配置
   * 职责：遍历所有列，初始化或更新列的 schema
   */
  const formatColumns = () => {
    sortColumns.length = 0;
    let skipColNum = 0;

    (tableColumnList || []).forEach((col, index) => {
      // 计算 span 配置
      const spanConfig = needColSpan.value
        ? getColumnSpanConfig(col, index, skipColNum)
        : { skipCol: false, skipColumnNum: 0, skipColLen: 0 };

      skipColNum = spanConfig.skipColumnNum;

      // 首次处理该列时，初始化 schema
      if (!tableColumnSchema.has(col)) {
        const sortFilterConfig = initColumnFilterSort(col);
        const schema = createColumnSchema(col, sortFilterConfig, spanConfig);
        tableColumnSchema.set(col, schema);
      } else {
        // 已存在的列，仅更新 span 配置
        updateColumnSpanConfig(col, spanConfig);
      }
    });
  };

  const setFixedStyle = (column: Column, style: { left?: string; right?: string }) => {
    const existing = tableColumnSchema.get(column)?.[COLUMN_ATTRIBUTE.COL_FIXED_STYLE];
    if (existing) {
      // 清空旧属性，避免 left 和 right 同时存在
      for (const key in existing) {
        delete existing[key];
      }
      // 更新响应式对象而不是替换它，保持响应性
      Object.assign(existing, style);
    }
  };

  const getFixedStyle = (column: Column) => {
    return getColumnAttribute(column, COLUMN_ATTRIBUTE.COL_FIXED_STYLE) ?? {};
  };

  // 兼容旧名称（拼写错误），将在未来版本移除
  const getFixedStlye = getFixedStyle;

  const getColumnRect = (column: Column) => {
    return getColumnAttribute(column, COLUMN_ATTRIBUTE.COL_RECT);
  };

  const getColumnCalcWidth = (column: Column) => {
    return getColumnAttribute(column, COLUMN_ATTRIBUTE.CALC_WIDTH);
  };

  const getColumnWidth = (column: Column) => {
    return getColumnOrderWidth(column);
  };

  type ColumnRect = { left?: number; right?: number; width?: number; height?: number };
  const setColumnRect = (col, { left, right, width, height }: ColumnRect) => {
    const source = getColumnRect(col);
    const target = {
      left: left ?? source.left,
      right: right ?? source.right,
      width: width ?? source.width,
      height: height ?? source.height,
    };
    setColumnAttribute(col, COLUMN_ATTRIBUTE.COL_RECT, target);
  };

  // 用于缓存上一次的列配置，避免相同配置重复处理
  let lastColumnsHash = '';

  /**
   * 生成列配置的简单哈希，用于比较配置是否变化
   */
  const getColumnsHash = (cols: Column[]) => {
    if (!cols || cols.length === 0) return '';
    return cols.map(col => `${col.field || col.prop || ''}:${col.label || ''}`).join('|');
  };

  /**
   * 防抖更新列配置
   * 延迟时间设为 16ms（约一帧），确保多次快速调用只执行一次
   * leading: true 确保首次调用立即执行，避免首帧空白
   * trailing: true 确保最后一次调用会执行
   */
  const debounceUpdateColumns = debounce(
    (columns: Column[], onComplete?: () => void) => {
      // 检查配置是否真的变化了
      const newHash = getColumnsHash(columns);
      if (newHash === lastColumnsHash && tableColumnList.length > 0) {
        onComplete?.();
        return;
      }
      lastColumnsHash = newHash;

      tableColumnList.length = 0;
      tableColumnList.push(...flatColumnTemplate(columns));
      formatColumns();

      setVisibleColumns();
      onComplete?.();
    },
    16,
    { leading: true, trailing: true },
  );

  const setColumnIsHidden = (column: Column, value = false) => {
    setColumnAttribute(column, COLUMN_ATTRIBUTE.IS_HIDDEN, value);
  };

  const setColumnResizeWidth = (column: Column, value: number) => {
    setColumnAttribute(column, COLUMN_ATTRIBUTE.RESIZE_WIDTH, value);
  };

  const setColumnSortOption = (column: Column, option: Record<string, object>) => {
    const { type, fn, scope, active } = option;
    const target = {
      [COLUMN_ATTRIBUTE.COL_SORT_TYPE]: type,
      [COLUMN_ATTRIBUTE.COL_SORT_FN]: fn,
      [COLUMN_ATTRIBUTE.COL_SORT_ACTIVE]: active,
      [COLUMN_ATTRIBUTE.COL_SORT_SCOPE]: scope,
    };

    [
      COLUMN_ATTRIBUTE.COL_SORT_TYPE,
      COLUMN_ATTRIBUTE.COL_SORT_FN,
      COLUMN_ATTRIBUTE.COL_SORT_ACTIVE,
      COLUMN_ATTRIBUTE.COL_SORT_SCOPE,
    ].forEach(name => {
      if (target[name] !== undefined) {
        setColumnAttribute(column, name, target[name]);
      }
    });
  };

  const setColumnFilterOption = (column: Column, option: Record<string, object>) => {
    if (tableColumnSchema.has(column)) {
      Object.assign(tableColumnSchema.get(column)[COLUMN_ATTRIBUTE.COL_FILTER_OBJ], option);
    }
  };

  // 宽度优先级：拖拽宽度 > 计算宽度 > 配置宽度
  const ORDER_LIST = [COLUMN_ATTRIBUTE.RESIZE_WIDTH, COLUMN_ATTRIBUTE.CALC_WIDTH, COLUMN_ATTRIBUTE.WIDTH];

  /**
   * 获取当前列实际宽度
   * width props中设置的默认宽度
   * calcWidth 计算后的宽度
   * resizeWidth 拖拽重置之后的宽度
   * @param colmun 当前列配置
   * @param orders 获取宽度顺序
   * @returns
   */
  const getColumnOrderWidth = (col: Column, orders = ORDER_LIST): number => {
    return (
      getColumnAttribute(col, orders[0]) ?? getColumnAttribute(col, orders[1]) ?? getColumnAttribute(col, orders[2])
    );
  };

  /**
   * 指定列是否展示状态
   * @param col
   */
  const isHiddenColumn = (col: Column) => {
    return getColumnAttribute(col, COLUMN_ATTRIBUTE.IS_HIDDEN) ?? false;
  };

  /**
   * 获取列所在ID
   * @param col
   */
  const getColumnId = (col: Column) => {
    return getColumnAttribute(col, COLUMN_ATTRIBUTE.COL_UID);
  };

  const beforeAttributeChange = (
    column: Column,
    attrName: string,
    attrValue:
      | ((...args) => boolean | number | string | void)
      | Record<string, object>
      | Record<string, object>[]
      | boolean
      | number
      | object
      | string,
  ) => {
    const sortAttrs = [COLUMN_ATTRIBUTE.COL_SORT_FN, COLUMN_ATTRIBUTE.COL_SORT_SCOPE, COLUMN_ATTRIBUTE.COL_SORT_TYPE];
    if (sortAttrs.includes(attrName)) {
      setSortColumns(column, { [attrName]: attrValue });
    }

    const filterAttrs = [COLUMN_ATTRIBUTE.COL_FILTER_FN, COLUMN_ATTRIBUTE.COL_FILTER_VALUES];
    if (filterAttrs.includes(attrName)) {
      setFilterColumns(column, { [attrName]: attrValue });
    }
  };

  const setNextColumnWidth = (col: Column, newWidth: number) => {
    const index = visibleColumns.findIndex(item => item === col);
    const diffWidth = getColumnOrderWidth(col) - newWidth;
    const nextColumn = visibleColumns[index + 1];
    if (nextColumn) {
      // 兼容旧逻辑：该方法仅在 resize 场景使用，应写入 resizeWidth
      setColumnAttribute(nextColumn, COLUMN_ATTRIBUTE.RESIZE_WIDTH, getColumnOrderWidth(nextColumn) + diffWidth);
    }
  };

  /**
   * 设置表格列属性
   * @param col 当前列
   * @param attrName 设置属性
   * @param attrValue 属性值
   */
  const setColumnAttribute = (
    col: Column,
    attrName: string,
    attrValue:
      | ((...args) => boolean | number | string | void)
      | Record<string, object>
      | Record<string, object>[]
      | boolean
      | number
      | object
      | string,
  ) => {
    beforeAttributeChange(col, attrName, attrValue);
    const target = tableColumnSchema.get(col);
    if (target && Object.prototype.hasOwnProperty.call(target, attrName)) {
      if (isRef(target[attrName])) {
        target[attrName].value = attrValue;
        return;
      }

      target[attrName] = attrValue;
    }
  };

  const setColumnAttributeBySettings = (settings: Settings, checkedVal?: string[]) => {
    const checked = checkedVal || settings.checked || [];
    const settingFields = settings.fields || [];

    tableColumnList.forEach(col => {
      setColumnAttribute(col, COLUMN_ATTRIBUTE.IS_HIDDEN, isColumnHidden(settingFields, col, checked));
    });
  };

  /**
   * 获取列配置属性值
   * @param col
   * @param attributeName
   */
  const getColumnAttribute = (col: Column | IEmptyObject, attributeName: string) => {
    const target = tableColumnSchema.get(col)?.[attributeName];
    if (isRef(target)) {
      return target.value;
    }

    return target;
  };

  const getColumnRefAttribute = (col: Column | IEmptyObject, attributeName: string) => {
    return tableColumnSchema.get(col)?.[attributeName];
  };

  const activeColumns = computed(() => resolveActiveColumns(props));
  const isActiveColumn = (column: Column, colIndex?: number) => {
    const idx = visibleColumns.indexOf(column);
    const realIndex = idx >= 0 ? idx : (colIndex ?? -1);
    return realIndex >= 0 && activeColumns.value.includes(realIndex);
  };

  const getColumnClass = (column: Column, colIndex: number) => ({
    [`${uuid}-column-${colIndex}`]: false,
    column_fixed: !!column.fixed,
    column_fixed_left: !!column.fixed && column.fixed !== 'right',
    column_fixed_right: column.fixed === 'right',
    active: isActiveColumn(column, colIndex),
  });

  const getHeadColumnClass = (column: Column, colIndex: number) => ({
    ...getColumnClass(column, colIndex),
  });

  /**
   * 获取用户自定义class
   * @param column
   * @param row
   * @private
   */
  const getColumnCustomClass = (column, row?: Record<string, object>) => {
    const rowClass = column.className;
    if (rowClass) {
      if (typeof rowClass === 'function') {
        return rowClass(row);
      }
      if (typeof rowClass === 'string') {
        return rowClass;
      }
    }
    return '';
  };

  /**
   * 设置指定列是否激活排序
   * @param column
   * @param active
   */
  const setColumnSortActive = (column: Column, active: boolean) => {
    if (props.colSortBehavior === IColSortBehavior.independent) {
      tableColumnList.forEach(col => {
        setColumnAttribute(col, COLUMN_ATTRIBUTE.COL_SORT_ACTIVE, false);
      });
    }
    setColumnAttribute(column, COLUMN_ATTRIBUTE.COL_SORT_ACTIVE, active);
  };

  /**
   * 清理列排序
   * @param reset 是否重置表格数据
   */
  const clearColumnSort = () => {
    tableColumnList.forEach(col => {
      setColumnAttribute(col, COLUMN_ATTRIBUTE.COL_SORT_ACTIVE, false);
      setColumnAttribute(col, COLUMN_ATTRIBUTE.COL_FILTER_FN, undefined);
    });
  };

  /**
   * 清理表头全选操作
   */
  const clearSelectionAll = () => {
    const col = visibleColumns.find(item => item.type === 'selection');
    if (col) {
      setColumnAttribute(col, COLUMN_ATTRIBUTE.SELECTION_VAL, false);
      setColumnAttribute(col, COLUMN_ATTRIBUTE.SELECTION_INDETERMINATE, false);
    }
  };

  const getPreColumn = (col: Column) => {
    const index = visibleColumns.findIndex(item => item === col);
    const preIndex = index - 1;
    return visibleColumns[preIndex];
  };

  const getColumnIndex = (col: Column) => {
    return visibleColumns.findIndex(item => item === col);
  };

  const getLeftColumnsWidth = (col: Column, includingSelf = false) => {
    let isContinue = true;
    let width = 0;
    let index = 0;
    while (isContinue && index < visibleColumns.length) {
      if (col === visibleColumns[index]) {
        if (includingSelf) {
          width = width + getColumnWidth(visibleColumns[index]);
        }
        isContinue = false;
        break;
      }

      width = width + getColumnWidth(visibleColumns[index]);
      index = index + 1;
    }

    return width;
  };

  return {
    needColSpan,
    needRowSpan,
    tableColumnSchema,
    tableColumnList,
    visibleColumns,
    debounceUpdateColumns,
    sortColumns,
    filterColumns,
    columnGroup,
    columnGroupMap,
    // 版本号用于追踪状态变化，避免深度监听
    sortVersion,
    filterVersion,
    columnsVersion,
    clearColumnSort,
    clearSelectionAll,
    formatColumns,
    flatColumnTemplate,
    isHiddenColumn,
    getColumnId,
    getColumnOrderWidth,
    getColumnAttribute,
    getHeadColumnClass,
    getColumnClass,
    getFixedStyle,
    getFixedStlye,
    getColumnRect,
    getColumnCustomClass,
    getColumnRefAttribute,
    getColumnCalcWidth,
    getColumnWidth,
    getLeftColumnsWidth,
    getGroupAttribute,
    getPreColumn,
    getColumnIndex,
    resolveEventListener,
    setColumnIsHidden,
    setColumnResizeWidth,
    setColumnSortOption,
    setColumnFilterOption,
    setColumnAttributeBySettings,
    setColumnAttribute,
    setColumnSortActive,
    setFixedStyle,
    setColumnRect,
    setVisibleColumns,
    setNextColumnWidth,
    resolveColsCalcWidth,
  };
};

export type UseColumns = ReturnType<typeof useColumns>;
export default useColumns;
