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
import { get as objGet } from 'lodash';
import { computed, onMounted, reactive, ref, watch } from 'vue';

import { classes, resolveClassName } from '@bkui-vue/shared';

import { BORDER_OPTION, LINE_HEIGHT, SCROLLY_WIDTH, SETTING_SIZE, TABLE_ROW_ATTRIBUTE } from './const';
import useActiveColumns from './plugins/use-active-columns';
import useColumnResize from './plugins/use-column-resize';
import useFixedColumn from './plugins/use-fixed-column';
import { Colgroups, Column, Settings, TablePropTypes } from './props';
import useColumn from './use-column';
import {
  getRowKey,
  hasRootScrollY,
  resolveHeadConfig,
  resolveNumberOrStringToPix,
  resolvePropBorderToClassStr,
  resolvePropVal,
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
  const hasScrollY = ref(undefined);
  const hasFooter = computed(() => props.pagination && props.data.length);
  const tableClass = computed(() => (classes({
    [resolveClassName('table')]: true,
    'has-footer': hasFooter.value,
    'has-scroll-y': hasScrollY.value || props.virtualEnabled,
  }, resolvePropBorderToClassStr(props.border))));

  const headClass = classes({
    [resolveClassName('table-head')]: true,
    'has-settings': !!props.settings,
  });

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
    const columns = getColumns();
    if (columns.every((col: Column) => /^\d+\.?\d*(px)?$/ig.test(`${col.width}`))) {
      const rectWidth = columns.reduce((width: number, col: Column) => width + Number(`${col.width}`.replace(/px/ig, '')), 0);
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
    const resolveFooterHeight = props.pagination && props.data.length ? LINE_HEIGHT : 0;
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

  const updateColGroups = () => {
    colgroups.splice(0, colgroups.length, ...(getColumns())
      .map(col => ({
        ...col,
        calcWidth: null,
        resizeWidth: null,
        listeners: new Map(),
      })));
  };

  const { dragOffsetXStyle, dragOffsetX, resetResizeEvents, registerResizeEvent } = useColumnResize(colgroups, true);
  const { activeColumns } = useActiveColumns(props, targetColumns);

  watch(() => [props.columns, targetColumns], () => {
    updateColGroups();
    resetResizeEvents();
    registerResizeEvent();
  }, { immediate: true, deep: true });

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
  });

  const isRowExpand = (rowId: any) => {
    if (reactiveSchema.rowActions.has(rowId)) {
      return reactiveSchema.rowActions.get(rowId)?.isExpand;
    }

    return false;
  };

  const setRowExpand = (row: any, expand = undefined) => {
    const rowId = row[TABLE_ROW_ATTRIBUTE.ROW_UID];
    const isExpand = typeof expand === 'boolean' ? expand : !isRowExpand(rowId);
    reactiveSchema.rowActions.set(rowId, Object.assign({}, reactiveSchema.rowActions.get(rowId) ?? {}, { isExpand }));
    updateIndexData();
  };

  const isSelectionAll = () => {
    if (reactiveSchema.rowActions.has(TABLE_ROW_ATTRIBUTE.ROW_SELECTION_ALL)) {
      return reactiveSchema.rowActions.get(TABLE_ROW_ATTRIBUTE.ROW_SELECTION_ALL);
    }

    if (!!props.selectionKey) {
      return indexData.every((row: any) => resolveSelectionRow(row));
    }

    return false;
  };

  /**
   * 用于多选表格，切换所有行的选中状态
   * @param checked 是否选中
   * @param update 是否触发更新表格数据, 如果是初始化时根据用户数据初始化全选状态，此时不需要update，如果是通过页面点击操作全选，则需要update
   */
  const toggleAllSelection = (checked = undefined) => {
    const isChecked = typeof checked === 'boolean' ? checked : !isSelectionAll();
    reactiveSchema.rowActions.set(TABLE_ROW_ATTRIBUTE.ROW_SELECTION_ALL, isChecked);
    updateIndexData();
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
      updateIndexData();
    }
  };

  const resolveSelectionRow = (row: any, thenFn = () => false) => {
    if (typeof props.isSelectedFn === 'function') {
      return Reflect.apply(props.isSelectedFn, this, [{ row, data: props.data }]);
    }

    if (typeof props.selectionKey === 'string' && props.selectionKey.length) {
      return objGet(row, props.selectionKey);
    }

    return thenFn();
  };

  const resolveSelection = (row: any, rowId: string) => resolveSelectionRow(row, () => {
    if (isSelectionAll()) {
      return true;
    }

    if (reactiveSchema.rowActions.has(rowId)) {
      return reactiveSchema.rowActions.get(rowId)?.isSelected;
    }

    if (Object.prototype.hasOwnProperty.call(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION) && typeof row[TABLE_ROW_ATTRIBUTE.ROW_SELECTION] === 'boolean') {
      return row[TABLE_ROW_ATTRIBUTE.ROW_SELECTION];
    }

    return false;
  });


  /**
   * 生成内置index
   */
  const indexData = reactive([]);

  const initIndexData = (keepLocalAction = false) => {
    indexData.splice(0, indexData.length, ...props.data.map((item: any, index: number) => {
      const rowId = getRowKey(item, props, index);

      return {
        ...item,
        [TABLE_ROW_ATTRIBUTE.ROW_INDEX]: index,
        [TABLE_ROW_ATTRIBUTE.ROW_UID]: rowId,
        [TABLE_ROW_ATTRIBUTE.ROW_EXPAND]: keepLocalAction ? isRowExpand(rowId) : false,
        [TABLE_ROW_ATTRIBUTE.ROW_SELECTION]: resolveSelection(item, rowId),
      };
    }));
  };

  const updateIndexData = () => {
    indexData.forEach((item: any) => {
      Object.assign(item, {
        [TABLE_ROW_ATTRIBUTE.ROW_EXPAND]: isRowExpand(item[TABLE_ROW_ATTRIBUTE.ROW_UID]),
        [TABLE_ROW_ATTRIBUTE.ROW_SELECTION]: resolveSelection(item, item[TABLE_ROW_ATTRIBUTE.ROW_UID]),
      });
    });
  };

  const { renderFixedColumns, fixedWrapperClass } = useFixedColumn(props, colgroups, false);

  return {
    colgroups,
    dragOffsetXStyle,
    dragOffsetX,
    reactiveSchema,
    indexData,
    fixedWrapperClass,
    initIndexData,
    updateIndexData,
    renderFixedColumns,
    setRowExpand,
    updateColGroups,
    clearSelection,
    toggleAllSelection,
    toggleRowSelection,
  };
};
