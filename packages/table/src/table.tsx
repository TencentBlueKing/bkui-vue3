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

import { computed, defineComponent, getCurrentInstance, nextTick, provide, ref, SetupContext, watch } from 'vue';

import { debounce, isElement } from 'lodash';

import { COLUMN_ATTRIBUTE, PROVIDE_KEY_INIT_COL, SCROLLY_WIDTH, TABLE_ROW_ATTRIBUTE } from './const';
import { EMIT_EVENT_TYPES } from './events';
import useColumnResize from './hooks/use-column-resize';
import useColumnTemplate from './hooks/use-column-template';
import useColumns from './hooks/use-columns';
import useDraggable from './hooks/use-draggable';
import useFixedColumn from './hooks/use-fixed-column';
import useLayout from './hooks/use-layout';
import useObserverResize from './hooks/use-observer-resize';
import usePagination from './hooks/use-pagination';
import useRender from './hooks/use-render';
import useRows from './hooks/use-rows';
import useSettings from './hooks/use-settings';
import { tableProps } from './props';

export default defineComponent({
  name: 'Table',
  props: tableProps,
  emits: EMIT_EVENT_TYPES,
  setup(props, ctx: SetupContext) {
    const columns = useColumns(props);
    const rows = useRows(props);
    const pagination = usePagination(props);

    const {
      renderContainer,
      renderFixedBottom,
      renderBody,
      renderHeader,
      renderFooter,
      setBodyHeight,
      setFootHeight,
      setDragOffsetX,
      setOffsetRight,
      setHeaderRowCount,
      refBody,
      refRoot,
    } = useLayout(props, ctx);

    /**
     * 设置字段结束，展示字段改变，设置表格偏移量为0
     * 避免太长横向滚动导致数据不可见
     * @param fields
     */
    const afterSetting = fields => {
      if (fields?.length > 0) {
        refBody.value?.scrollTo(0, 0);
      }
    };

    const settings = useSettings(props, ctx, columns, afterSetting);
    const dragEvents = useDraggable(props, rows, ctx);

    const { renderColumns, renderTBody, renderTFoot, setDragEvents } = useRender({
      props,
      ctx,
      columns,
      rows,
      pagination,
      settings,
    });

    setDragEvents(dragEvents as Record<string, () => void>);

    const { resolveColumns } = useColumnTemplate();

    const instance = getCurrentInstance();
    const initTableColumns = () => {
      const children = instance.subTree?.children ?? [];
      columns.debounceUpdateColumns(resolveColumns(children), () => {
        setHeaderRowCount(columns.columnGroup.length);
      });
    };

    provide(PROVIDE_KEY_INIT_COL, initTableColumns);

    const { renderFixedRows, resolveFixedColumnStyle } = useFixedColumn(props, columns);

    /**
     * Column配置改变或者容器Resize之后，根据Columns配置
     * 计算每一列的实际宽度
     */
    const computedColumnRect = () => {
      const width = refRoot.value?.offsetWidth - (props.scrollbar ? 1 : SCROLLY_WIDTH) ?? 0;
      columns.resolveColsCalcWidth(width);
      resolveFixedColumnStyle();
    };

    const { dragOffsetX } = useColumnResize(columns, { afterResize: resolveFixedColumnStyle });

    const isResizeBodyHeight = ref(false);

    /**
     * table 渲染行
     */
    const getRenderRowList = (list: Record<string, object>[]) => {
      if (!pagination.isShowPagination.value || props.remotePagination) {
        return list;
      }

      const startIndex = (pagination.options.current - 1) * pagination.options.limit;
      const endIndex = startIndex + pagination.options.limit;

      return list.slice(startIndex, endIndex);
    };

    const getFilterAndSortList = () => {
      let renderList = rows.tableRowList.value.slice();

      columns.filterColumns.forEach(item => {
        if (
          !columns.isHiddenColumn(item.col) &&
          item[COLUMN_ATTRIBUTE.COL_FILTER_FN] &&
          item[COLUMN_ATTRIBUTE.COL_FILTER_VALUES]?.length
        ) {
          renderList = renderList.filter((row, index) =>
            item[COLUMN_ATTRIBUTE.COL_FILTER_FN](item[COLUMN_ATTRIBUTE.COL_FILTER_VALUES], row, index, props.data),
          );
        }
      });

      columns.sortColumns.forEach(item => {
        if (!columns.isHiddenColumn(item.col) && item[COLUMN_ATTRIBUTE.COL_SORT_FN] && item.active) {
          renderList.sort((a, b) => {
            let index0 = null;
            let index1 = null;
            if (item.col.type === 'index') {
              index0 = rows.getRowAttribute(a, TABLE_ROW_ATTRIBUTE.ROW_INDEX);
              index1 = rows.getRowAttribute(b, TABLE_ROW_ATTRIBUTE.ROW_INDEX);
            }
            return item[COLUMN_ATTRIBUTE.COL_SORT_FN](a, b, index0, index1);
          });
        }
      });

      return renderList;
    };

    const footHeight = computed(() => {
      return pagination.isShowPagination.value ? props.paginationHeight : 0;
    });

    const setTableFootHeight = () => {
      setFootHeight(footHeight.value);
      if (/^\d+\.?\d*(px)?$/.test(`${props.height}`)) {
        setBodyHeight(Number(`${props.height}`.replace('px', '')));
      }
    };

    const setTableData = debounce((resetScroll = true) => {
      const filterOrderList = getFilterAndSortList();
      if (!props.remotePagination) {
        pagination.setPagination({ count: filterOrderList.length });
      }

      const renderList = getRenderRowList(filterOrderList);
      rows.setPageRowList(renderList);

      nextTick(() => {
        setOffsetRight();

        if (resetScroll) {
          refBody.value?.scrollTo(0, 0);
        }
      });
    }, 64);

    const observerResizing = ref(false);
    let observerResizingTimer = null;

    useObserverResize(refRoot, () => {
      if (!observerResizing.value) {
        observerResizing.value = true;
        if ((props.height === '100%' || props.virtualEnabled) && isElement(refRoot.value)) {
          if (isResizeBodyHeight.value) {
            setTimeout(() => {
              isResizeBodyHeight.value = false;
            });
            return;
          }
          const tableHeight = refRoot.value.offsetHeight;
          isResizeBodyHeight.value = true;
          setBodyHeight(tableHeight);
          setOffsetRight();
        }
        computedColumnRect();
        setOffsetRight();
        refBody.value?.scrollTo(0, 0);
        return;
      }

      observerResizingTimer && clearTimeout(observerResizingTimer);
      observerResizingTimer = setTimeout(() => {
        observerResizing.value = false;
      });
    });

    watch(
      () => [props.columns],
      () => {
        columns.debounceUpdateColumns(props.columns, () => {
          setHeaderRowCount(columns.columnGroup.length);
        });
      },
      { immediate: true },
    );

    watch(
      () => [dragOffsetX.value],
      () => {
        setDragOffsetX(dragOffsetX.value);
      },
    );

    watch(
      () => [columns.visibleColumns],
      () => {
        nextTick(() => computedColumnRect());
      },
      { immediate: true, deep: true },
    );

    watch(
      () => [columns.sortColumns, columns.filterColumns],
      () => {
        setTableData();
      },
      { deep: true },
    );

    watch(
      () => [pagination.isShowPagination.value],
      () => {
        setTableFootHeight();
      },
      { immediate: true },
    );

    watch(
      () => [props.data],
      () => {
        rows.setTableRowList(props.data);
        setTableData(false);
      },
      { immediate: true, deep: true },
    );

    watch(
      () => [pagination.options.count, pagination.options.limit, pagination.options.current],
      () => {
        setTableData();
      },
      { immediate: true },
    );

    ctx.expose({
      setRowExpand: rows.setRowExpand,
      setAllRowExpand: rows.setAllRowExpand,
      clearSelection: () => {
        rows.clearSelection();
        columns.clearSelectionAll();
      },
      toggleAllSelection: rows.toggleAllSelection,
      toggleRowSelection: rows.toggleRowSelection,
      getSelection: rows.getRowSelection,
      clearSort: columns.clearColumnSort,
      scrollTo,
      getRoot: () => refRoot.value,
    });

    return () =>
      renderContainer([
        renderHeader(renderColumns, settings.renderSettings, renderFixedRows),
        renderBody(rows.pageRowList, renderTBody, renderFixedRows),
        renderFixedBottom(),
        renderFooter(renderTFoot()),
      ]);
  },
});
