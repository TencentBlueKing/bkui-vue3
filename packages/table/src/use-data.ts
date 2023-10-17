import { Ref, computed, reactive } from "vue";
import { Column, IColSortBehavior, Settings, SortScope, TablePropTypes } from "./props";
import { v4 as uuidv4 } from 'uuid';
import { CHECK_ALL_OBJ, COLUMN_ATTRIBUTE, COL_MIN_WIDTH, SETTING_SIZE, TABLE_ROW_ATTRIBUTE } from "./const";
import { getRowValue, isColumnHidden, resolveCellSpan, resolveColumnSortProp } from "./utils";
import usePagination from "./plugins/use-pagination";

export type ITableFormatData = {
  data: any[],
  dataSchema: WeakMap<object, any>,
  columnSchema: WeakMap<object, any>,
  columns: Column[],
  settings: {
    size: string,
    height: number
  },
  layout: {
    bottom: number,
    translateX: number,
    translateY: number
  }
}

export type ITableResponse = {
  formatColumns: (columns: Column[]) => void,
  formatDataSchema: (data: any[]) => void,
  setRowSelection: (row: any, isSelected: boolean) => void,
  setRowExpand: (row: any, isExpand: boolean) => void,
  setRowIndex: (row: any, index: number) => void,
  setColumnAttribute: (col: Column, attrName: string, attrValue: ((...args) => boolean | number | void | string) | string | boolean | number) => void,
  setColumnAttributeBySettings: (settings: Settings, checkedVal?: string[]) => void,
  getColumnAttributeValue: (col: Column, attributeName: string) => string | boolean | Record<string, any>,
  getColumnId: (col: Column) => string,
  getColumnOrderWidth: (column: Column, orders?: string[]) => number,
  isActiveColumn: (col: Column) => boolean,
  isHiddenColumn: (col: Column) => boolean,
  resolvePageData: (filterFn?: any, sortFn?: any, column?: Column, type?: string, sortScope?: SortScope) => void,
  toggleRowSelection: (row: any) => void,
  toggleAllSelection: (value?: boolean) => void,
  setAllRowExpand: (value?: boolean) => void,
  clearSelection: () => void,
  setColumnSortActive: (column: Column, active: boolean) => void,
  getRowAttribute: (row: any, attrName: string) => any,
  resolveColumnWidth: (root: HTMLElement, autoWidth?, offsetWidth?) => void,
  filter: () => void,
  sortData: (column: Column) => void,
  pageData: any[],
  localPagination: any,
  formatData: ITableFormatData,
  isCheckedAll: Ref<boolean>,
  hasCheckedRow: Ref<boolean>,
}

export default (props: TablePropTypes): ITableResponse => {
  const { size } = props.settings as Settings;
  const height = SETTING_SIZE[size] || SETTING_SIZE.small;

  const formatData: ITableFormatData = reactive({
    data: [...props.data],
    dataSchema: new WeakMap(),
    columns: [...props.columns],
    columnSchema: new WeakMap(),
    settings: {
      size,
      height
    },
    layout: {
      bottom: 0,
      translateX: 0,
      translateY: 0
    }
  });

  const { pageData, localPagination, resolvePageData, multiFilter, sort } = usePagination(props);

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

  const checked = (props.settings as Settings)?.checked || [];
  const settingFields = (props.settings as Settings)?.fields || [];

  const formatColumns = (columns: Column[]) => {
    formatData.columns.length = 0;
    formatData.columns = columns;

    (columns || []).forEach(col => {
      if (!formatData.columnSchema.has(col)) {
        const { type, fn, scope, active } = resolveColumnSortProp(col, props);
        formatData.columnSchema.set(col, {
          [COLUMN_ATTRIBUTE.CALC_WIDTH]: undefined,
          [COLUMN_ATTRIBUTE.RESIZE_WIDTH]: undefined,
          [COLUMN_ATTRIBUTE.COL_MIN_WIDTH]: resolveMinWidth(col),
          [COLUMN_ATTRIBUTE.LISTENERS]: new Map(),
          [COLUMN_ATTRIBUTE.WIDTH]: col.width,
          [COLUMN_ATTRIBUTE.IS_HIDDEN]: isColumnHidden(settingFields, col, checked),
          [COLUMN_ATTRIBUTE.COL_SORT_TYPE]: type,
          [COLUMN_ATTRIBUTE.COL_SORT_FN]: fn,
          [COLUMN_ATTRIBUTE.COL_FILTER_FN]: undefined,
          [COLUMN_ATTRIBUTE.COL_FILTER_SCOPE]: undefined,
          [COLUMN_ATTRIBUTE.COL_SORT_SCOPE]: scope,
          [COLUMN_ATTRIBUTE.COL_SORT_ACTIVE]: active,
          [COLUMN_ATTRIBUTE.COL_UID]: uuidv4(),
        });
      }
    });
  }

  const getColumnFilterFn = (col: Column) => getColumnAttributeValue(col, COLUMN_ATTRIBUTE.COL_FILTER_FN);

  const filter = () => {
    const filterFnList = formatData.columns
      .filter(col => !isHiddenColumn(col) && typeof getColumnFilterFn(col) === 'function')
      .map(col => getColumnFilterFn(col));

    multiFilter(filterFnList);
  };


  const sortData = (column: Column) => {
    const fn = getColumnAttributeValue(column, COLUMN_ATTRIBUTE.COL_SORT_FN);
    const type = getColumnAttributeValue(column, COLUMN_ATTRIBUTE.COL_SORT_TYPE);
    const scope = getColumnAttributeValue(column, COLUMN_ATTRIBUTE.COL_SORT_SCOPE);
    sort(pageData, fn, column, type, scope);
  };

  const setColumnSortActive = (column: Column, active: boolean) => {
    if (props.colSortBehavior === IColSortBehavior.independent) {
      formatData.columns.forEach(col => {
        formatData.columnSchema.get(col)[COLUMN_ATTRIBUTE.COL_SORT_ACTIVE] = false;
      });
    }

    formatData.columnSchema.get(column)[COLUMN_ATTRIBUTE.COL_SORT_ACTIVE] = active;
  };

  /**
   * 是否数据全选
   */
  const isCheckedAll = computed(() => {
    if (props.acrossAll) {
      return formatData.data.every(row => getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION));
    }

    return pageData.every(row => getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION));
  });


  /**
   * 是否有选中的数据
   */
  const hasCheckedRow = computed(() => {
    if (props.acrossAll) {
      return formatData.data.some(row => getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION));
    }

    return pageData.some(row => getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION));
  });

  /**
   * 当前列是否激活状态
   * @param col
   */
  const isActiveColumn = (col: Column) => {
    return formatData.columnSchema.get(col)?.[COLUMN_ATTRIBUTE.IS_HIDDEN] ?? false;
  }

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
    const target = formatData.columnSchema.get(col) ?? {};
    return target[orders[0]] ?? target[orders[1]] ?? target[orders[2]];
  }

  /**
   * 指定列是否展示状态
   * @param col
   */
  const isHiddenColumn = (col: Column) => {
    return formatData.columnSchema.get(col)?.[COLUMN_ATTRIBUTE.IS_HIDDEN] ?? false;
  }

  /**
   * 获取列所在ID
   * @param col
   */
  const getColumnId = (col: Column) => {
    return formatData.columnSchema.get(col)?.[COLUMN_ATTRIBUTE.COL_UID];
  }

  /**
   * 设置表格列属性
   * @param col 当前列
   * @param attrName 设置属性
   * @param attrValue 属性值
   */
  const setColumnAttribute = (col: Column, attrName: string, attrValue: ((...args) => boolean | number | void | string) | string | boolean | number) => {
    const target = formatData.columnSchema.get(col);
    if (target && Object.prototype.hasOwnProperty.call(target, attrName)) {
      target[attrName] = attrValue;
    }
  }

  const setColumnAttributeBySettings = (settings: Settings, checkedVal?: string[]) => {
    const checked = checkedVal || settings.checked || [];
    const settingFields = settings.fields || [];

    formatData.columns.forEach(col => {
      setColumnAttribute(col, COLUMN_ATTRIBUTE.IS_HIDDEN, isColumnHidden(settingFields, col, checked));
    });
  }

  /**
   * 获取列配置属性值
   * @param col
   * @param attributeName
   */
  const getColumnAttributeValue = (col: Column, attributeName: string) => {
    return formatData.columnSchema.get(col)?.[attributeName];
  }

  /**
   * 判定当前行是否选中
   * @param row
   */
  const isRowSelected = (row) => {
    if (!props.isRowSelectEnable) {
      return false;
    }

    if (typeof props.isSelectedFn === 'function') {
      return props.isSelectedFn({ row });
    }

    if (Array.isArray(props.checked)) {
      return props.checked.some(item => {
        if (typeof item === 'string') {
          return getRowValue(row, item) === item;
        }

        return item === row;
      });
    }

    return false;
  }

  /**
   * 判定是否需要合并行或者列配置
   */
  const neepColspanOrRowspan = computed(() =>
    formatData.columns.some(
      col =>
        typeof col.rowspan === 'function' ||
        /^\d$/.test(`${col.rowspan}`) ||
        typeof col.colspan === 'function' ||
        /^\d$/.test(`${col.colspan}`),
    ),
  );

  const getSkipConfig = (row: any, rowId: string, rowIndex: number, skipCfg: any, preRowId: string) => {
    if (!neepColspanOrRowspan.value) {
      return {}
    }

    let skipColumnNum = 0;
    const preRowConfig = skipCfg[preRowId] ?? {};

    if (!skipCfg[rowId]) {
      skipCfg[rowId] = {};
    }

    formatData.columns.forEach((column, index) => {
      const { colspan, rowspan } = resolveCellSpan(column, index, row, rowIndex);
      const colId = column[COLUMN_ATTRIBUTE.COL_UID];
      const preRowColSkipLen = preRowConfig[colId]?.skipRowLen ?? 0;
      const target = {
        [colId]: {
          skipRowLen: 0,
          skipRow: false,
          skipCol: false,
          skipColLen: 0,
        },
      };

      if (skipColumnNum > 0) {
        target[colId].skipColLen = skipColumnNum;
        target[colId].skipCol = true;
        skipColumnNum = skipColumnNum - 1;
      }

      if (preRowColSkipLen > 1) {
        target[colId].skipRowLen = preRowColSkipLen - 1;
        target[colId].skipRow = true;
      } else {
        if (rowspan > 1) {
          target[colId].skipRowLen = rowspan;
          target[colId].skipRow = false;
        }
      }

      if (colspan > 1) {
        target[colId].skipColLen = colspan;
        skipColumnNum = colspan - 1;
      }

      Object.assign(skipCfg[rowId], target);
    });

    return skipCfg[rowId];
  };

  const formatDataSchema = (data: any[]) => {
    formatData.data.length = 0;
    formatData.data = data;

    let preRowId = null;
    const skipConfig = {};

    (data || []).forEach((row, index) => {
      let rowId = uuidv4();
      const cfg = getSkipConfig(row, rowId, index, skipConfig, preRowId);

      if (!formatData.dataSchema.has(row)) {
        formatData.dataSchema.set(row, {
          [TABLE_ROW_ATTRIBUTE.ROW_EXPAND]: false,
          [TABLE_ROW_ATTRIBUTE.ROW_SELECTION]: isRowSelected(row),
          [TABLE_ROW_ATTRIBUTE.ROW_UID]: rowId,
          [TABLE_ROW_ATTRIBUTE.ROW_SKIP_CFG]: cfg,
          [TABLE_ROW_ATTRIBUTE.ROW_INDEX]: (index + 1),
        });
      }

      // 当传入的data改变时，更新相关属性
      // ROW_EXPAND & ROW_SELECTION & ROW_UID 不做更新
      const target = formatData.dataSchema.get(row);
      rowId = target[TABLE_ROW_ATTRIBUTE.ROW_UID];
      target[TABLE_ROW_ATTRIBUTE.ROW_SKIP_CFG] = cfg;
      target[TABLE_ROW_ATTRIBUTE.ROW_INDEX] = (index + 1);
      preRowId = preRowId;
    });

    formatData.dataSchema.set(CHECK_ALL_OBJ, {
      [TABLE_ROW_ATTRIBUTE.ROW_SELECTION]: false
    });
  };

  /**
   * 设置列属性
   * @param row
   * @param attrName
   * @param attrValue
   */
  const setRowAttribute = (row: any, attrName: string, attrValue: string | boolean | number) => {
    const target = formatData.dataSchema.get(row);
    if (target && Object.prototype.hasOwnProperty.call(target, attrName)) {
      target[attrName] = attrValue;
    };
  }

  /**
   * 设置当前行是否选中
   * @param row
   * @param isSelected
   */
  const setRowSelection = (row: any, isSelected: boolean) => {
    setRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION, isSelected);
  }

  const setRowIndex = (row: any, index: number) => {
    setRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_INDEX, index);
  }

  /**
   *  设置当前行是否展开
   * @param row
   * @param isExpand
   */
  const setRowExpand = (row: any, isExpand: boolean) => {
    setRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_EXPAND, isExpand);
  }

  const getRowAttribute = (row: any, attrName: string) => {
    return formatData.dataSchema.get(row)?.[attrName];
  }

  const toggleRowSelection = (row: any) => {
    setRowSelection(row, !getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION))
  }

  const getTargetSelectionValue = () => {
    if (isCheckedAll.value) {
      return false;
    }

    return true;
  }

  const toggleAllSelection = (value?: boolean) => {
    const val = value ?? getTargetSelectionValue();
    if (props.acrossAll) {
      formatData.data.forEach(row => setRowSelection(row, val));
      return;
    }

    pageData.forEach(row => setRowSelection(row, val));
  }

  const clearSelection = () => {
    formatData.data.forEach(row => setRowSelection(row, false));
  }

  const setAllRowExpand = (value?: boolean) => {
    formatData.data.forEach(row => setRowExpand(row, value ?? true));
  }

  /**
 * 根据Props Column配置计算并设置列宽度
 * @param root 当前根元素
 * @param autoWidth 自动填充宽度
 * @param offsetWidth 需要减掉的偏移量（滚动条|外层边框）
 */
  const resolveColumnWidth = (root: HTMLElement, autoWidth = COL_MIN_WIDTH, offsetWidth = 0) => {
    const { width } = root.getBoundingClientRect() || {};
    const availableWidth = width - offsetWidth;
    // 可用来平均的宽度
    let avgWidth = availableWidth;

    // 需要平均宽度的列数
    const avgColIndexList = [];

    const getMinWidth = (col: Column, computedWidth: number) => {
      const minWidth = getColumnAttributeValue(col, COLUMN_ATTRIBUTE.COL_MIN_WIDTH);
      if (minWidth === undefined) {
        if (computedWidth < COL_MIN_WIDTH) {
          return COL_MIN_WIDTH;
        }

        return computedWidth;
      }

      let calcMinWidth = computedWidth;
      if (/^\d+\.?\d*$/.test(`${minWidth}`)) {
        calcMinWidth = Number(minWidth);
      }

      if (/^\d+\.?\d*%$/.test(`${minWidth}`)) {
        calcMinWidth = (Number(minWidth) * availableWidth) / 100;
      }

      if (/^\d+\.?\d*px$/i.test(`${minWidth}`)) {
        calcMinWidth = Number(`${minWidth}`.replace(/px/i, ''));
      }

      return calcMinWidth;
    };

    /**
     * 根据Props Column配置计算并设置列宽度
     * @param col 当前Column设置
     * @param numWidth 计算宽度
     * @param resetAvgWidth 是否重置可用宽度
     */
    const resolveColNumberWidth = (col: Column, numWidth: number, resetAvgWidth = true) => {
      const minWidth = getMinWidth(col, numWidth);
      const computedWidth = numWidth < minWidth ? minWidth : numWidth;
      Object.assign(col, { calcWidth: computedWidth });
      if (resetAvgWidth) {
        avgWidth = avgWidth - computedWidth;
        if (avgWidth < 0) {
          avgWidth = 0;
        }
      }
    };

    formatData.columns.forEach((col: Column, index: number) => {
      if (!isHiddenColumn(col)) {
        const order = ['resizeWidth', 'width'];
        const colWidth = String(getColumnOrderWidth(col, order));
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
            perWidth = (avgWidth * percent) / 100;
          }

          resolveColNumberWidth(col, perWidth);
          isAutoWidthCol = false;
        }

        if (isAutoWidthCol) {
          avgColIndexList.push(index);
        }
      }
    });

    // 自适应宽度计算
    if (avgColIndexList.length > 0) {
      let autoAvgWidth = autoWidth;
      if (avgWidth > 0) {
        avgColIndexList.forEach((idx, index) => {
          autoAvgWidth = avgWidth / (avgColIndexList.length - index);
          resolveColNumberWidth(formatData.columns[idx], autoAvgWidth, false);
          const calcWidth = getColumnAttributeValue(formatData.columns[idx], COLUMN_ATTRIBUTE.CALC_WIDTH);
          avgWidth = avgWidth - calcWidth;
        });
      } else {
        avgColIndexList.forEach(idx => {
          const calcWidth = getMinWidth(formatData.columns[idx], COL_MIN_WIDTH);
          setColumnAttribute(formatData.columns[idx], COLUMN_ATTRIBUTE.CALC_WIDTH, calcWidth);
        });
      }
    }
  };


  return {
    formatColumns,
    formatDataSchema,
    setRowSelection,
    setRowExpand,
    setRowIndex,
    setColumnAttribute,
    setColumnAttributeBySettings,
    setColumnSortActive,
    getColumnAttributeValue,
    getColumnId,
    getColumnOrderWidth,
    resolveColumnWidth,
    isActiveColumn,
    isHiddenColumn,
    resolvePageData,
    toggleAllSelection,
    setAllRowExpand,
    clearSelection,
    toggleRowSelection,
    getRowAttribute,
    filter,
    sortData,
    isCheckedAll,
    hasCheckedRow,
    pageData,
    localPagination,
    formatData
  }
}
