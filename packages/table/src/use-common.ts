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
import { debounce, get as objGet, has as objHas, set as objSet } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { computed, onMounted, reactive, ref, watch } from 'vue';

import { classes, resolveClassName } from '@bkui-vue/shared';

import { BORDER_OPTION, COL_MIN_WIDTH, COLUMN_ATTRIBUTE, LINE_HEIGHT, SCROLLY_WIDTH, SETTING_SIZE, TABLE_ROW_ATTRIBUTE } from './const';
import useActiveColumns from './plugins/use-active-columns';
import useColumnResize from './plugins/use-column-resize';
import useFixedColumn from './plugins/use-fixed-column';
import { Colgroups, Column, Settings, TablePropTypes } from './props';
import useColumn from './use-column';
import {
  getRowKey,
  hasRootScrollY,
  isColumnHidden,
  isRowSelectEnable,
  resolveCellSpan,
  resolveHeadConfig,
  resolveNumberOrStringToPix,
  resolvePropBorderToClassStr,
  resolvePropVal,
  resolveSort,
} from './utils';

/**
 * 渲染class settings
 * @param props: TablePropTypes
 * @param targetColumns 解析之后的column配置（主要用来处理通过<bk-column>配置的数据结构）
 * @param root root element
 * @param reactiveProp 组件内部定义的响应式对象
 * @param pageData 当前页数据
 */
export const useClass = (props: TablePropTypes, targetColumns: Column[], root?, reactiveProp?, pageData?: any[]) => {
  const { getColumns } = useColumn(props, targetColumns);
  const autoHeight = ref(200);
  const hasScrollY = ref(false);
  const hasFooter = computed(() => props.pagination && props.data.length);
  const hasScrollYRef = computed(() => hasScrollY.value);
  const tableClass = computed(() => (classes({
    [resolveClassName('table')]: true,
    'has-footer': hasFooter.value,
    'has-scroll-y': hasScrollY.value || props.virtualEnabled,
  }, resolvePropBorderToClassStr(props.border))));

  const headClass = classes({
    [resolveClassName('table-head')]: true,
    'has-settings': !!props.settings,
  });

  const resolvedColumns = computed(() => getColumns());

  const config = resolveHeadConfig(props);
  const headStyle = computed(() => ({
    '--row-height': `${resolvePropVal(config, 'height', ['thead'])}px`,
    '--scroll-head-left': `-${reactiveProp.scrollTranslateX}px`,
    '--scroll-left': `${reactiveProp.scrollTranslateX}px`,
  }));

  const contentClass = {
    [resolveClassName('table-body')]: true,
  };

  const footerClass = computed(() => classes({
    [resolveClassName('table-footer')]: true,
    ['is-hidden']: !props.pagination || !props.data.length,
  }));

  const resolveWidth = () => {
    // const columns = getColumns();
    if (resolvedColumns.value.every((col: Column) => /^\d+\.?\d*(px)?$/ig.test(`${col.width}`))) {
      const rectWidth = resolvedColumns.value.reduce((width: number, col: Column) => width + Number(`${col.width}`.replace(/px/ig, '')), 0);
      const offset = hasScrollY.value ? SCROLLY_WIDTH : 0;
      return `${rectWidth + offset}px`;
    }

    return '100%';
  };

  /** 表格外层容器样式 */
  const wrapperStyle = computed(() => ({
    minHeight: resolveNumberOrStringToPix(props.minHeight, 'auto'),
    width: resolveWidth(),
    maxWidth: '100%',
  }));


  const resolvePropHeight = (height: Number | string, defaultValue: number) => {
    const strHeight = String(height);
    if (/^\d+\.?\d*$/.test(strHeight)) {
      return Number(strHeight);
    }

    if (/^\d+\.?\d*px$/ig.test(strHeight)) {
      return Number(strHeight.replace('px', ''));
    }

    if (/^\d+\.?\d*%$/ig.test(strHeight) && typeof defaultValue === 'number') {
      const percent = Number(strHeight.replace('%', ''));
      return defaultValue * percent / 100;
    }

    return defaultValue;
  };

  /** 表格外层容器样式 */
  const contentStyle = reactive({
    display: '',
    'min-height': '',
    height: '',
    maxHeight: '',
  });

  const getHeadHeight = () => (props.showHead ? resolvePropHeight(props.headHeight, LINE_HEIGHT) : 0);

  const resolveContentStyle = () => {
    const resolveHeight = resolvePropHeight(props.height, autoHeight.value);
    const resolveHeadHeight = getHeadHeight();
    const resolveMinHeight = resolvePropHeight(props.minHeight, autoHeight.value);
    const resolveFooterHeight = props.pagination && props.data.length ? props.paginationHeihgt : 0;
    const contentHeight = resolveHeight - resolveHeadHeight - resolveFooterHeight;
    const height = props.height !== 'auto' ? `${contentHeight}px` : false;
    const minHeight = resolveMinHeight - resolveHeadHeight - resolveFooterHeight;
    const resolveMaxHeight = resolvePropHeight(props.maxHeight, undefined);
    const maxHeight = typeof resolveMaxHeight === 'number'
      ? `${resolveMaxHeight - resolveHeadHeight - resolveFooterHeight}px`
      : false;

    Object.assign(contentStyle, {
      display: pageData?.length ? 'block' : false,
      'min-height': `${minHeight}px`,
      height,
      maxHeight,
    });
  };

  onMounted(() => {
    resetTableHeight(root?.value);
  });

  const resetTableHeight = (rootEl: HTMLElement) => {
    if (rootEl) {
      const { height } = rootEl.parentElement.getBoundingClientRect();
      autoHeight.value = height;
      resolveContentStyle();
      updateBorderClass(rootEl);
    }
  };

  const updateBorderClass = (root: HTMLElement) => {
    if (!root) {
      return;
    }
    const querySelector = props.virtualEnabled
      ? `.${resolveClassName('virtual-section')}`
      : `.${resolveClassName('table-body-content')}`;
    const rootBody = root.querySelector('.bk-table-body');

    hasScrollY.value = hasRootScrollY(rootBody, querySelector, 0);
  };

  /**
   * 获取当前table计算column宽度需要减去的边框和scroll填充
   * @returns 宽度
   */
  const getColumnsWidthOffsetWidth = () => {
    let offsetWidth = 0;
    if (hasScrollY.value) {
      offsetWidth = offsetWidth + SCROLLY_WIDTH;
    }

    if (props.border.includes(BORDER_OPTION.OUTER) && !props.border.includes(BORDER_OPTION.NONE)) {
      offsetWidth = offsetWidth + 2;
    }

    return offsetWidth;
  };

  return {
    tableClass,
    headClass,
    contentClass,
    footerClass,
    wrapperStyle,
    contentStyle,
    headStyle,
    resetTableHeight,
    updateBorderClass,
    getColumnsWidthOffsetWidth,
    hasFooter,
    hasScrollY,
    hasScrollYRef,
  };
};


/**
 * 渲染初始化数据 settings
 * @param props: TablePropTypes
 * @param targetColumns 解析之后的column配置（主要用来处理通过<bk-column>配置的数据结构）
 */
export const useInit = (props: TablePropTypes, targetColumns: Column[]) => {
  const colgroups: Colgroups[] = reactive([]);
  const { getColumns } = useColumn(props, targetColumns);

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

  const resolvedColumns = computed(() => getColumns());

  const updateColGroups = (settings?: Settings) => {
    const checked = settings?.checked || (props.settings as Settings)?.checked || [];
    const settingFields = settings?.fields || (props.settings as Settings)?.fields || [];
    colgroups.length = 0;
    colgroups.push(...(resolvedColumns.value)
      .map(col => ({
        ...col,
        calcWidth: null,
        resizeWidth: null,
        minWidth: resolveMinWidth(col),
        listeners: new Map(),
        isHidden: isColumnHidden(settingFields, col, checked),
        [COLUMN_ATTRIBUTE.COL_UID]: uuidv4(),
        [COLUMN_ATTRIBUTE.COL_SOURCE_DATA]: col,
      })));
  };

  if (typeof props.settings === 'object') {
    updateColGroups(props.settings as Settings);
  }

  const { dragOffsetXStyle, dragOffsetX, resetResizeEvents, registerResizeEvent } = useColumnResize(colgroups, true);
  const { activeColumns } = useActiveColumns(props, targetColumns);

  watch(() => [props.settings], () => {
    if (((props.settings as Settings)?.checked || []).length) {
      updateColGroups();
    }
  });

  const debounceColUpdate = debounce(() => {
    updateColGroups();
    resetResizeEvents();
    registerResizeEvent();
  }, 120);
  watch(() => resolvedColumns, () => {
    debounceColUpdate();
  }, { immediate: true, deep: true });

  const defSort = props.columns.reduce((out: any, col, index) => {
    const columnName = resolvePropVal(col, ['field', 'type'], [col, index]);
    const sort = resolveSort(col.sort);
    if (sort) {
      return { ...(out || {}), [columnName]: sort?.value };
    }
    return out;
  }, null);

  const reactiveSchema = reactive({
    rowActions: new Map(),
    scrollTranslateY: 0,
    scrollTranslateX: 0,
    pos: {
      bottom: 1,
    },
    activeColumns,
    settings: props.settings,
    setting: {
      size: (props.settings as Settings)?.size,
      height: SETTING_SIZE[(props.settings as Settings)?.size],
    },
    defaultSort: defSort || props.defaultSort,
  });

  const isRowExpand = (rowId: any) => {
    if (reactiveSchema.rowActions.has(rowId)) {
      return reactiveSchema.rowActions.get(rowId)?.isExpand;
    }

    return false;
  };

  const clearSort = () => {
    if (Array.isArray(reactiveSchema.defaultSort)) {
      reactiveSchema.defaultSort.splice(0);
    }

    reactiveSchema.defaultSort = defSort || props.defaultSort;
  };

  const setRowExpand = (row: any, expand = undefined) => {
    const rowId = row[TABLE_ROW_ATTRIBUTE.ROW_UID];
    const isExpand = typeof expand === 'boolean' ? expand : !isRowExpand(rowId);
    reactiveSchema.rowActions.set(rowId, Object.assign({}, reactiveSchema.rowActions.get(rowId) ?? {}, { isExpand }));
    updateIndexData();
  };

  /**
   * 判定是否全选
   * @returns
   */
  const isSelectionAll = () => {
    if (reactiveSchema.rowActions.has(TABLE_ROW_ATTRIBUTE.ROW_SELECTION_ALL)) {
      return reactiveSchema.rowActions.get(TABLE_ROW_ATTRIBUTE.ROW_SELECTION_ALL);
    }

    // 如果设置了selectionKey，则根据用户传入数据判定
    if (!!props.selectionKey) {
      return indexData.every((row: any) => resolveSelectionRow(row));
    }

    return false;
  };

  const validateSelectionFn = (row: any) => {
    const rowId = row[TABLE_ROW_ATTRIBUTE.ROW_UID];
    const { isSelected = false } = reactiveSchema.rowActions.get(rowId) || {};
    return isSelected;
  };

  /**
   * 根据每行勾选状态更新全选checkbox勾选状态
   * 此方法在toggleRowSelection触发，所以必定有一行是被选中或者被取消勾选
   * 更新全选、半选状态
   */
  const updateSelectionAll = (validateFn = validateSelectionFn) => {
    let hasUnchecked = false;
    let hasChecked = false;

    indexData.forEach((row) => {
      const isSelected = validateFn(row);
      // 判定是否有未选中数据
      if (!hasUnchecked && !isSelected) {
        hasUnchecked = true;
      }

      // 判定是否有选定数据
      if (!hasChecked && isSelected) {
        hasChecked = true;
      }
    });

    reactiveSchema.rowActions.set(TABLE_ROW_ATTRIBUTE.ROW_SELECTION_INDETERMINATE, hasChecked && hasUnchecked);
    reactiveSchema.rowActions.set(TABLE_ROW_ATTRIBUTE.ROW_SELECTION_ALL, hasChecked && !hasUnchecked);
  };

  const isSelectionEnable = () => props.columns.some(col => col.type === 'selection');

  /**
   * 用于初始化时，根据用户传入数据进行初始化操作
   */
  const initSelectionAllByData = () =>  {
    if (isSelectionEnable()) {
      updateSelectionAll(row => resolveSelectionRow(row));
    }
  };

  /**
   * 用于多选表格，切换所有行的选中状态
   * @param checked 是否选中
   * @param update 是否触发更新表格数据, 如果是初始化时根据用户数据初始化全选状态，此时不需要update，如果是通过页面点击操作全选，则需要update
   */
  const toggleAllSelection = (checked = undefined) => {
    const isChecked = typeof checked === 'boolean' ? checked : !isSelectionAll();
    reactiveSchema.rowActions.set(TABLE_ROW_ATTRIBUTE.ROW_SELECTION_ALL, isChecked);
    reactiveSchema.rowActions.set(TABLE_ROW_ATTRIBUTE.ROW_SELECTION_INDETERMINATE, false);
    indexData.forEach((row: any, index) => {
      if (isRowSelectEnable(props, { row, index, isCheckAll: false })) {
        const rowId = row[TABLE_ROW_ATTRIBUTE.ROW_UID];
        const target = Object.assign({}, reactiveSchema.rowActions.get(rowId) ?? {}, { isSelected: isChecked });
        reactiveSchema.rowActions.set(rowId, target);
      }
    });

    updateSelectionAll();
    updateIndexData(isChecked);
    asyncSelection(null, checked, true);
  };

  const clearSelection = () => {
    toggleAllSelection(false);
  };

  /**
   * 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
   * @param row
   * @param selected
   */
  const toggleRowSelection = (row: any, selected: boolean) => {
    const rowId = row[TABLE_ROW_ATTRIBUTE.ROW_UID];
    if (rowId) {
      const isSelected = typeof selected === 'boolean' ? selected : !resolveSelection(row, rowId);
      const target = Object.assign({}, reactiveSchema.rowActions.get(rowId) ?? {}, { isSelected });
      reactiveSchema.rowActions.set(rowId, target);

      // 如果是取消勾选，则全选状态取消
      if (!selected) {
        reactiveSchema.rowActions.set(TABLE_ROW_ATTRIBUTE.ROW_SELECTION_ALL, false);
      }

      // 根据每行勾选状态更新全选checkbox勾选状态
      updateSelectionAll();
      updateIndexData();
      asyncSelection(row, selected, false);
    }
  };

  /**
   * 通过table data 判定指定row是否选中
   * @param row 指定row
   * @param thenFn 如果table data没有满足判定条件，后续判定逻辑函数，返回 boolean
   * @returns Boolean
   */
  const resolveSelectionRow = (row: any, thenFn = row => validateSelectionFn(row)) => {
    if (typeof props.isSelectedFn === 'function') {
      return Reflect.apply(props.isSelectedFn, this, [{ row, data: props.data }]);
    }

    if (typeof props.selectionKey === 'string' && props.selectionKey.length) {
      return objGet(row, props.selectionKey);
    }

    return thenFn(row);
  };

  /**
   * 判定指定row是否选中
   * @param row 指定row
   * @param rowId 指定row id
   * @returns boolean
   */
  const resolveSelection = (row: any, _rowId?: string, index?: number) => resolveSelectionRow(row, () => {
    const rowId = _rowId === undefined ? row[TABLE_ROW_ATTRIBUTE.ROW_UID] : _rowId;
    if (isRowSelectEnable(props, { row, index, isCheckAll: false }) && isSelectionAll()) {
      return true;
    }

    if (reactiveSchema.rowActions.has(rowId)) {
      return reactiveSchema.rowActions.get(rowId)?.isSelected;
    }

    return false;
  });


  /**
   * 生成内置index
   */
  const indexData = reactive([]);

  const neepColspanOrRowspan = computed(() => colgroups.some(col => typeof col.rowspan === 'function' || /^\d$/.test(`${col.rowspan}`) || typeof col.colspan === 'function' || /^\d$/.test(`${col.colspan}`)));

  const needSelection = computed(() => colgroups.some(col => col.type === 'selection'));

  const needExpand = computed(() => colgroups.some(col => col.type === 'expand'));

  const needIndexColumn = computed(() => colgroups.some(col => col.type === 'index'));

  const initIndexData = (keepLocalAction = false) => {
    let preRowId = null;
    const skipConfig = {};

    if (neepColspanOrRowspan.value || needSelection.value || needExpand.value || needIndexColumn.value) {
      const copyData = props.data.map((item: any, index: number) => {
        const rowId = getRowKey(item, props, index);

        preRowId = rowId;
        const target = {
          ...item,
          [TABLE_ROW_ATTRIBUTE.ROW_UID]: rowId,
          [TABLE_ROW_ATTRIBUTE.ROW_SOURCE_DATA]: { ...item },
        };

        if (neepColspanOrRowspan.value) {
          const cfg = getSkipConfig(item, rowId, index, skipConfig, preRowId);
          Object.assign(target, { [TABLE_ROW_ATTRIBUTE.ROW_SKIP_CFG]: cfg });
        }

        if (needSelection.value) {
          Object.assign(target, { [TABLE_ROW_ATTRIBUTE.ROW_SELECTION]: resolveSelection(item, rowId, index) });
        }

        if (needIndexColumn.value) {
          Object.assign(target, { [TABLE_ROW_ATTRIBUTE.ROW_INDEX]: index });
        }

        if (needExpand.value) {
          Object.assign(target, { [TABLE_ROW_ATTRIBUTE.ROW_EXPAND]: keepLocalAction ? isRowExpand(rowId) : false });
        }

        return target;
      });
      indexData.length = 0;
      indexData.push(...copyData);

      if (needSelection.value) {
        initSelectionAllByData();
      }
      return;
    }

    indexData.length = 0;
    indexData.push(...props.data);
  };

  /**
   * 判定当前行是否选中
   * @param isRowCheckEnable
   * @param selectedAll
   * @param item
   * @returns
   */
  const isRowChecked = (isRowCheckEnable, selectedAll, item, index) => {
    const isChecked = resolveSelection(item, item[TABLE_ROW_ATTRIBUTE.ROW_UID], index);
    if (isRowCheckEnable) {
      return typeof selectedAll === 'boolean' ? selectedAll : isChecked;
    }

    return isChecked;
  };

  const updateIndexData = (selectedAll?: boolean) => {
    if (neepColspanOrRowspan.value || needSelection.value || needExpand.value || needIndexColumn.value) {
      let preRowId = null;
      const skipConfig = {};
      indexData.forEach((item: any, index: number) => {
        const rowId = item[TABLE_ROW_ATTRIBUTE.ROW_UID];

        if (needExpand.value) {
          Object.assign(item, {
            [TABLE_ROW_ATTRIBUTE.ROW_EXPAND]: isRowExpand(item[TABLE_ROW_ATTRIBUTE.ROW_UID]),
          });
        }

        if (neepColspanOrRowspan.value) {
          const cfg = getSkipConfig(item, rowId, index, skipConfig, preRowId);
          preRowId = item[TABLE_ROW_ATTRIBUTE.ROW_UID];

          Object.assign(item, {
            [TABLE_ROW_ATTRIBUTE.ROW_SKIP_CFG]: cfg,
          });
        }

        if (needIndexColumn.value) {
          Object.assign(item, { [TABLE_ROW_ATTRIBUTE.ROW_INDEX]: index });
        }

        if (needSelection.value) {
          const isRowCheckEnable = isRowSelectEnable(props, { row: item, index, isCheckAll: false });
          Object.assign(item, {
            [TABLE_ROW_ATTRIBUTE.ROW_SELECTION]: isRowChecked(isRowCheckEnable, selectedAll, item, index),
          });
        }
      });

      if (needSelection.value && typeof selectedAll !== 'boolean') {
        initSelectionAllByData();
      }

      return;
    }
  };

  const getSkipConfig = (row: any, rowId: string, rowIndex: number, skipCfg: any, preRowId: string) => {
    let skipColumnNum = 0;
    const preRowConfig = skipCfg[preRowId] ?? {};

    if (!skipCfg[rowId]) {
      skipCfg[rowId] = {};
    }

    colgroups.forEach((column, index) => {
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

      Object.assign(skipCfg[rowId], { ...target });
    });

    return skipCfg[rowId];
  };

  const debounceUpdate = debounce(updateIndexData, 120);
  watch([neepColspanOrRowspan, needSelection, needExpand, needIndexColumn], () => {
    debounceUpdate();
  });

  /**
   * 如果设置了数据同步，点击操作更新选中状态到用户数据
   * @param row 当前操作行
   * @param value 选中状态
   * @param all 是否全选
   */
  const asyncSelection = (row: any, value: boolean, all = false) => {
    if (props.asyncData && props.rowKey) {
      if (all) {
        props.data.forEach((item: any) => {
          if (objHas(item, props.selectionKey)) {
            objSet(item, props.selectionKey, !!value);
          }
        });
      } else {
        if (objHas(row, props.selectionKey)) {
          const target = props.data.find((item: any) => objGet(item, props.rowKey) === objGet(row, props.rowKey));
          objSet(target, props.selectionKey, !!value);
        }
      }
    }
  };

  const {
    fixedColumns,
    resolveColumnStyle,
    resolveColumnClass,
    fixedWrapperClass,
  } = useFixedColumn(props, colgroups, false);

  /**
   * 获取已经勾选的数据
   * @returns
   */
  const getSelection = () => indexData.filter(row => resolveSelection(row));

  return {
    colgroups,
    dragOffsetXStyle,
    dragOffsetX,
    reactiveSchema,
    indexData,
    fixedWrapperClass,
    fixedColumns,
    resolveColumnStyle,
    resolveColumnClass,
    initIndexData,
    updateIndexData,
    setRowExpand,
    updateColGroups,
    clearSelection,
    toggleAllSelection,
    toggleRowSelection,
    getSelection,
    clearSort,
  };
};
