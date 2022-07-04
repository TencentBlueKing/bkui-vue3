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
import { computed, onMounted, reactive, ref, watch } from 'vue';

import { classes, resolveClassName } from '@bkui-vue/shared';

import { BORDER_OPTION, SCROLLY_WIDTH, SETTING_SIZE, TABLE_ROW_ATTRIBUTE } from './const';
import useActiveColumns from './plugins/use-active-columns';
import useColumnResize from './plugins/use-column-resize';
import useFixedColumn from './plugins/use-fixed-column';
import { Colgroups, Column, Settings, TablePropTypes } from './props';
import {
  getRowKey,
  hasRootScrollY,
  resolveHeadConfig,
  resolveNumberOrStringToPix,
  resolvePropBorderToClassStr,
  resolvePropVal,
} from './utils';

export const useClass = (props: TablePropTypes, root?, reactiveProp?, pageData?: any[]) => {
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
    if (props.columns.every((col: Column) => /^\d+\.?\d*(px)?$/ig.test(`${col.width}`))) {
      const rectWidth = props.columns.reduce((width: number, col: Column) => width + Number(`${col.width}`.replace(/px/ig, '')), 0);
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

    if (/^\d+\.?\d*%$/ig.test(strHeight)) {
      const percent = Number(strHeight.replace('%', ''));
      return defaultValue * percent / 100;
    }

    return defaultValue;
  };

  /** 表格外层容器样式 */
  const contentStyle = reactive({});

  const resolveContentStyle = () => {
    const resolveHeight = resolvePropHeight(props.height, autoHeight.value);
    const resolveHeadHeight = props.showHead ? resolvePropHeight(props.headHeight, 40) + 2 : 0;
    const resolveMinHeight = resolvePropHeight(props.minHeight, autoHeight.value);
    const resolveFooterHeight = props.pagination && props.data.length ? 40 : 0;
    const contentHeight = resolveHeight - resolveHeadHeight - resolveFooterHeight;
    const height = props.height !== 'auto' ? `${contentHeight}px` : false;
    const minHeight = resolveMinHeight - resolveHeadHeight - resolveFooterHeight;
    Object.assign(contentStyle, {
      display: pageData?.length ? 'block' : false,
      'min-height': `${minHeight}px`,
      height,
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

    hasScrollY.value = hasRootScrollY(root, querySelector);
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

export const useInit = (props: TablePropTypes) => {
  const colgroups: Colgroups[] = reactive([]);
  const updateColGroups = () => {
    colgroups.splice(0, colgroups.length, ...(props.columns ?? [])
      .map(col => ({
        ...col,
        calcWidth: null,
        resizeWidth: null,
        listeners: new Map(),
      })));
  };

  watch(() => props.columns, () => {
    updateColGroups();
  }, { immediate: true, deep: true });

  const { dragOffsetXStyle, dragOffsetX } = useColumnResize(colgroups, true);
  const { activeColumns } = useActiveColumns(props);

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
      };
    }));
  };

  const updateIndexData = () => {
    indexData.forEach((item: any) => {
      Object.assign(item, {
        [TABLE_ROW_ATTRIBUTE.ROW_EXPAND]: isRowExpand(item[TABLE_ROW_ATTRIBUTE.ROW_UID]),
      });
    });
  };

  const { renderFixedColumns, fixedWrapperClass } = useFixedColumn(props, colgroups);

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
  };
};
