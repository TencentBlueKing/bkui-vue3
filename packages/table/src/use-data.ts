import { computed, reactive } from "vue";
import { Column, IColSortBehavior, Settings, TablePropTypes } from "./props";
import { v4 as uuidv4 } from 'uuid';
import { CHECK_ALL_OBJ, COLUMN_ATTRIBUTE, COL_MIN_WIDTH, SETTING_SIZE, TABLE_ROW_ATTRIBUTE } from "./const";
import { getRowValue, isColumnHidden, resolveCellSpan, resolveColumnSortProp } from "./utils";
import usePagination from "./plugins/use-pagination";

export type ITableFormatData = {
  data: any[],
  dataSchema: WeakMap<object, any>,
  columnSchema: WeakMap<object, any>,
  columns: Column[],
  scrollTranslateX: number,
  scrollTranslateY: number,
  settings: {
    size: string,
    height: number
  }
}

export type ITableResponse = {
  formatColumns: (columns: Column[]) => void,
  formatDataSchema: (data: any[]) => void,
  setRowSelection: (row: any, isSelected: boolean) => void,
  setRowExpand: (row: any, isExpand: boolean) => void,
  setRowIndex: (row: any, index: number) => void,
  setColumnAttribute: (col: Column, attrName: string, attrValue: string | boolean) => void,
  setColumnAttributeBySettings: (settings: Settings, checkedVal?: string[]) => void,
  getColumnAttributeValue: (col: Column, attributeName: string) => string | boolean | Record<string, any>,
  isActiveColumn: (col: Column) => boolean,
  resolvePageData: (filterFn: any, sortFn: any, column: Column, type: string) => void,
  toggleRowSelection: (row: any) => void,
  toggleAllSelection: (value?: boolean) => void,
  setAllRowExpand: (value?: boolean) => void,
  clearSelection: () => void,
  watchEffectFn: (filterFn: any, sortFn: any, activeSortColumn: any) => void,
  setColumnSortActive: (column: Column, active: boolean) => void,
  getRowAttribute: (row: any, attrName: string) => any,
  pageData: any[],
  localPagination: any,
  formatData: ITableFormatData,
  isCheckedAll: boolean,
  hasCheckedRow: boolean,
}

export default (props: TablePropTypes) => {
  const { size } = props.settings as Settings;
  const height = SETTING_SIZE[size] || SETTING_SIZE.small;

  const formatData = reactive({
    data: props.data,
    dataSchema: new WeakMap(),
    columns: props.columns,
    columnSchema: new WeakMap(),
    scrollTranslateX: 0,
    scrollTranslateY: 0,
    settings: {
      size,
      height
    },
  });


  const { pageData, localPagination, resolvePageData, watchEffectFn } = usePagination(props);

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
          [COLUMN_ATTRIBUTE.CALC_WIDTH]: null,
          [COLUMN_ATTRIBUTE.RESIZE_WIDTH]: null,
          [COLUMN_ATTRIBUTE.COL_MIN_WIDTH]: resolveMinWidth(col),
          [COLUMN_ATTRIBUTE.LISTENERS]: new Map(),
          [COLUMN_ATTRIBUTE.IS_HIDDEN]: isColumnHidden(settingFields, col, checked),
          [COLUMN_ATTRIBUTE.COL_SORT_TYPE]: type,
          [COLUMN_ATTRIBUTE.COL_SORT_FN]: fn,
          [COLUMN_ATTRIBUTE.COL_SORT_SCOPE]: scope,
          [COLUMN_ATTRIBUTE.COL_SORT_ACTIVE]: active,
          [COLUMN_ATTRIBUTE.COL_UID]: uuidv4(),
        });
      }
    });
  }

  const setColumnSortActive = (column: Column, active: boolean) => {
    if (props.colSortBehavior === IColSortBehavior.independent) {
      formatData.columns.forEach(col => {
        formatData.columnSchema.get(col)[COLUMN_ATTRIBUTE.COL_SORT_ACTIVE] = false;
      });
    }

    formatData.columnSchema.get(column)[COLUMN_ATTRIBUTE.COL_SORT_ACTIVE] = active;
  }

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

  /**
   * 设置表格列属性
   * @param col 当前列
   * @param attrName 设置属性
   * @param attrValue 属性值
   */
  const setColumnAttribute = (col: Column, attrName: string, attrValue: string | boolean) => {
    const target = formatData.columnSchema.get(col);
    if (target && Object.prototype.hasOwnProperty.call(target, attrName)) {
      target[attrName] = attrValue;
    }
  }

  const setColumnAttributeBySettings = (settings: Settings, checkedVal?: string[]) => {
    const checked = checkedVal || settings.checked || [];
    const settingFields = settings.fields || [];

    props.columns.forEach(col => {
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
    props.columns.some(
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

    props.columns.forEach((column, index) => {
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
          [TABLE_ROW_ATTRIBUTE.ROW_INDEX]: index,
        });
      }

      // 当传入的data改变时，更新相关属性
      // ROW_EXPAND & ROW_SELECTION & ROW_UID 不做更新
      const target = formatData.dataSchema.get(row);
      rowId = target[TABLE_ROW_ATTRIBUTE.ROW_UID];
      target[TABLE_ROW_ATTRIBUTE.ROW_SKIP_CFG] = cfg;
      target[TABLE_ROW_ATTRIBUTE.ROW_INDEX] = index;
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
    isActiveColumn,
    resolvePageData,
    toggleAllSelection,
    setAllRowExpand,
    clearSelection,
    toggleRowSelection,
    watchEffectFn,
    getRowAttribute,
    isCheckedAll,
    hasCheckedRow,
    pageData,
    localPagination,
    formatData
  }
}
