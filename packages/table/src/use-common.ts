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

import { TABLE_ROW_ATTRIBUTE } from './const';
import useActiveColumns from './plugins/use-active-columns';
import useColumnResize from './plugins/use-column-resize';
import useFixedColumn from './plugins/use-fixed-column';
import { TablePropTypes } from './props';
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
  const hasScrollY = ref(false);
  const hasFooter = computed(() => props.pagination && props.data.length);
  const tableClass = computed(() => (classes({
    [resolveClassName('table')]: true,
    'has-footer': hasFooter.value,
    'has-scroll-y': hasScrollY.value || props.virtualEnabled,
    // 'is-scroll-bottom': reactiveProp.pos.bottom < 2,
  }, resolvePropBorderToClassStr(props.border))));

  const headClass = classes({
    [resolveClassName('table-head')]: true,
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

  /** 表格外层容器样式 */
  const wrapperStyle = computed(() => ({
    minHeight: resolveNumberOrStringToPix(props.minHeight, 'auto'),
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

  const getRowsHeight = () => {
    if (!pageData?.length) {
      return 0;
    }

    if (typeof props.rowHeight === 'function') {
      return pageData.reduce((out: number, row: any, rowIndex: number) => {
        const result = Reflect.apply(props.rowHeight, this, ['tbody', row, rowIndex]);
        let resultHeight = out;
        if (/^\d+\.?\d*px?$/.test(`${result}`)) {
          resultHeight += Number(result.replace(/px$/, ''));
        }
        return resultHeight;
      }, 0);
    }

    if (/^\d+\.?\d*px?$/.test(`${props.rowHeight}`)) {
      const rowHeight = props.rowHeight.replace(/px$/, '');
      return pageData.length * Number(rowHeight);
    }

    return 0;
  };

  /** 表格外层容器样式 */
  const contentStyle = reactive({});

  const resolveContentStyle = () => {
    const resolveHeight = resolvePropHeight(props.height, autoHeight.value);
    const resolveHeadHeight = props.showHead ? resolvePropHeight(props.headHeight, 40) + 2 : 0;
    const resolveMaxHeight = resolvePropHeight(props.maxHeight, autoHeight.value);
    const resolveMinHeight = resolvePropHeight(props.minHeight, autoHeight.value);

    const resolveFooterHeight = props.pagination && props.data.length ? 40 : 0;
    const contentHeight = resolveHeight - resolveHeadHeight - resolveFooterHeight;
    const height = props.height !== 'auto' ? `${contentHeight}px` : false;
    const maxHeight = resolveMaxHeight - resolveHeadHeight - resolveFooterHeight;
    const minHeight = resolveMinHeight - resolveHeadHeight - resolveFooterHeight;
    const rowsHeight = getRowsHeight();
    Object.assign(contentStyle, {
      display: pageData?.length ? 'block' : false,
      'max-height': `${maxHeight > rowsHeight ? maxHeight : rowsHeight}px`,
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
    hasScrollY.value = hasRootScrollY(root);
    if (root) {
      const tableBody = root.querySelector('.bk-table-body table') as HTMLElement;
      if (tableBody) {
        hasScrollY.value = tableBody.offsetHeight > root.offsetHeight;
      }
    }
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
    hasFooter,
    hasScrollY,
  };
};

export const useInit = (props: TablePropTypes) => {
  const colgroups = reactive([]);
  // hasScrollY.value = hasRootScrollY(root);
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

  const { dragOffsetXStyle } = useColumnResize(colgroups, true);
  const { activeColumns } = useActiveColumns(props);

  const reactiveSchema = reactive({
    rowActions: new Map(),
    scrollTranslateY: 0,
    scrollTranslateX: 0,
    pos: {
      bottom: 1,
    },
    activeColumns,
    setting: {
      size: null,
      height: null,
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
