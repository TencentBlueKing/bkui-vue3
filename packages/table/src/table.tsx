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

import { computed, defineComponent, getCurrentInstance, nextTick, provide, ref, SetupContext, watch } from 'vue';

import { bkTooltips } from '@bkui-vue/directives';
import debounce from 'lodash/debounce';
import isElement from 'lodash/isElement';

import { COLUMN_ATTRIBUTE, PROVIDE_KEY_INIT_COL, PROVIDE_KEY_COLUMN_REGISTRY, TABLE_ROW_ATTRIBUTE } from './const';
import { EMIT_EVENT_TYPES } from './events';
import useColumnResize from './hooks/use-column-resize';
import useColumnRegistry from './hooks/use-column-registry';
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
  directives: {
    bkTooltips,
  },
  props: tableProps,
  emits: EMIT_EVENT_TYPES,
  setup(props, ctx: SetupContext) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('BkTable 组件后续将不再维护，请迁移至新组件 @blueking/table');
    }
    const columns = useColumns(props);
    const rows = useRows(props);
    const pagination = usePagination(props);

    const {
      renderContainer,
      renderFixedBottom,
      renderBody,
      renderFooter,
      setBodyHeight,
      setFootHeight,
      setDragOffsetX,
      setOffsetRight,
      setHeaderRowCount,
      setLineHeight,
      getBodyHeight,
      refBody,
      refRoot,
      translateX,
    } = useLayout(props, ctx);

    const scrollTo = (...args) => refBody.value?.scrollTo(...args);

    if (typeof props.rowHeight === 'function') {
      setLineHeight(args => {
        return rows.getRowHeight(args.rows[0], args.index);
      });
    } else {
      setLineHeight(props.rowHeight);
    }

    /**
     * 设置字段结束，展示字段改变，设置表格偏移量为0
     * 避免太长横向滚动导致数据不可见
     * @param fields
     */
    const afterSetting = ({ checked, height }) => {
      if (checked?.length > 0) {
        scrollTo(0, 0);
      }

      if (typeof props.rowHeight !== 'function') {
        rows.setRowHeight(height);
        setLineHeight(height);
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
    });

    setDragEvents(dragEvents as Record<string, () => void>);

    const { resolveColumns } = useColumnTemplate();

    // 创建列注册表（用于增量更新）
    const columnRegistry = useColumnRegistry();

    const instance = getCurrentInstance();

    // 旧模式：VNode 全量解析（作为降级方案）
    const initTableColumns = () => {
      const children = instance.subTree?.children ?? [];
      columns.debounceUpdateColumns(resolveColumns(children), () => {
        setHeaderRowCount(columns.columnGroup.length);
      });
    };

    // 提供旧的初始化函数（降级模式使用）
    provide(PROVIDE_KEY_INIT_COL, initTableColumns);
    // 提供列注册表（新模式使用）
    provide(PROVIDE_KEY_COLUMN_REGISTRY, columnRegistry);

    // 监听列注册表版本变化（模板方式）
    // 当 TableColumn 组件注册/更新/注销时，版本号会递增
    watch(
      () => columnRegistry.version.value,
      () => {
        // 只有当没有使用 props.columns 配置时，才使用注册表中的列
        // 避免配置式和模板式混用时的冲突
        if (!props.columns?.length && columnRegistry.hasColumns()) {
          const registryColumns = columnRegistry.getColumns();
          columns.debounceUpdateColumns(registryColumns, () => {
            setHeaderRowCount(columns.columnGroup.length);
          });
        }
      },
    );

    const { renderFixedRows, resolveFixedColumnStyle } = useFixedColumn(props, columns);

    /**
     * Column配置改变或者容器Resize之后，根据Columns配置
     * 计算每一列的实际宽度
     */
    const computedColumnRect = () => {
      const scrollContainer = refBody.value?.refRoot as HTMLElement;
      const width = scrollContainer?.clientWidth ?? refRoot.value?.clientWidth ?? 0;
      columns.resolveColsCalcWidth(width);
      resolveFixedColumnStyle();
    };

    useColumnResize(columns, {
      afterResize: resolveFixedColumnStyle,
      onDragOffsetXChange: (val: number) => setDragOffsetX(val),
      getRootEl: () => refRoot.value,
      getTranslateX: () => translateX.value,
    });

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

    // 使用 computed 缓存过滤和排序结果，避免重复计算
    // 依赖：rows.tableRowList, columns.filterColumns, columns.sortColumns, filterVersion, sortVersion
    const filteredAndSortedList = computed(() => {
      // 引用版本号以确保依赖追踪正确
      void columns.filterVersion.value;
      void columns.sortVersion.value;

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
    });

    const footHeight = computed(() => {
      return pagination.isShowPagination.value ? props.paginationHeight : 0;
    });

    const hasNonPxHeight = () =>
      props.height != null && props.height !== 'auto' && !/^\d+\.?\d*(px)?$/.test(`${props.height}`);

    const needsDynamicBodyHeight = () =>
      props.virtualEnabled || hasNonPxHeight() || (props.height === 'auto' && props.maxHeight != null && props.maxHeight !== 'auto');

    const setTableFootHeight = () => {
      setFootHeight(footHeight.value);
      if (/^\d+\.?\d*(px)?$/.test(`${props.height}`)) {
        setBodyHeight(Number(`${props.height}`.replace('px', '')));
      } else if (needsDynamicBodyHeight() && isElement(refRoot.value) && refRoot.value.offsetHeight > 0) {
        setBodyHeight(refRoot.value.offsetHeight);
      }
    };

    const scrollTo00 = ref(false);

    const setTableData = debounce((resetScroll = true) => {
      // 使用缓存的过滤排序结果
      const filterOrderList = filteredAndSortedList.value;
      if (!props.remotePagination) {
        pagination.setPagination({ count: filterOrderList.length });
      }

      const renderList = getRenderRowList(filterOrderList);
      rows.setPageRowList(renderList);
      if (resetScroll) {
        scrollTo00.value = true;
      }

      nextTick(() => {
        setOffsetRight();
        setRowsBodyHeight();

        if (scrollTo00.value) {
          scrollTo(0, 0);
          scrollTo00.value = false;
        }
      });
    }, 64, { leading: true, trailing: true });

    const observerResizing = ref(false);
    let observerResizingTimer = null;

    useObserverResize(refRoot, () => {
      if (!observerResizing.value) {
        observerResizing.value = true;
        if (needsDynamicBodyHeight() && isElement(refRoot.value)) {
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
        scrollTo(0, 0);
        return;
      }

      observerResizingTimer && clearTimeout(observerResizingTimer);
      observerResizingTimer = setTimeout(() => {
        observerResizing.value = false;
      });
    });

    const isNumericPx = (val: unknown) => /^\d+\.?\d*(px)?$/.test(`${val}`);

    const hasMaxHeightConstraint = () =>
      props.maxHeight != null && props.maxHeight !== 'auto';

    const setRowsBodyHeight = () => {
      if (isNumericPx(props.height)) {
        return;
      }

      if (isNumericPx(props.maxHeight)) {
        const rowsHeight = rows.getCurrentPageRowsHeight();
        const maxHeight = getBodyHeight(Number(`${props.maxHeight}`.replace('px', '')));
        setBodyHeight(Math.min(rowsHeight, maxHeight), false);
      } else if (
        hasMaxHeightConstraint() &&
        isElement(refRoot.value) &&
        refRoot.value.offsetHeight > 0
      ) {
        const rowsHeight = rows.getCurrentPageRowsHeight();
        const resolvedMax = getBodyHeight(refRoot.value.offsetHeight);
        if (resolvedMax > 0) {
          setBodyHeight(Math.min(rowsHeight, resolvedMax), false);
        }
      }
    };

    // 监听 props.columns 变化（配置式用法）
    // 只有当 props.columns 有值时才使用，避免与模板方式冲突
    watch(
      () => [props.columns],
      () => {
        if (props.columns?.length > 0) {
          columns.debounceUpdateColumns(props.columns, () => {
            setHeaderRowCount(columns.columnGroup.length);
          });
        }
      },
      { immediate: true },
    );

    // drag offset is pushed into layout by useColumnResize via onDragOffsetXChange

    // 使用版本号监听替代深度监听，提升性能
    watch(
      () => columns.columnsVersion.value,
      () => {
        nextTick(() => computedColumnRect());
      },
      { immediate: true },
    );

    watch(
      () => columns.filterVersion.value,
      () => {
        setTableData();
      },
    );

    watch(
      () => columns.sortVersion.value,
      () => {
        setTableData(false);
      },
    );

    watch(
      () => [pagination.isShowPagination.value],
      () => {
        setTableFootHeight();
        nextTick(() => scrollTo(0, 0));
      },
      { immediate: true },
    );

    // 监听 data 变化
    // 注意：deep: true 对大数据量有性能影响，建议用户通过替换数组引用来触发更新
    // 如需手动刷新，可调用 exposed 的 refreshData 方法
    watch(
      () => props.data,
      () => {
        rows.setTableRowList(props.data);
        setTableData(false);
      },
      { immediate: true },
    );

    // 监听 data 数组长度变化，用于处理数组元素增减的情况
    watch(
      () => props.data?.length,
      (newLen, oldLen) => {
        if (newLen !== oldLen) {
          rows.setTableRowList(props.data);
          setTableData(false);
        }
      },
    );

    watch(
      () => [pagination.options.count, pagination.options.limit, pagination.options.current],
      () => {
        setTableData(false);
      },
      { immediate: true },
    );

    const pageListLength = computed(() => rows.pageRowList.length);

    watch(pageListLength, (val, old) => {
      if (val < old) {
        refBody?.value?.updateScroll?.();
        scrollTo(undefined, 0);
      }
    });

    // 手动刷新数据方法，用于用户直接修改数据对象属性后触发更新
    const refreshData = () => {
      rows.setTableRowList(props.data);
      setTableData(false);
    };

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
      setRowSelection: rows.setRowSelection,
      clearSort: columns.clearColumnSort,
      scrollTo,
      getRoot: () => refRoot.value,
      refreshData,
    });

    return () =>
      renderContainer([
        renderBody(
          rows.pageRowList,
          {
            header: renderColumns,
            body: renderTBody,
            settings: settings.renderSettings,
          },
          renderFixedRows,
        ),
        renderFixedBottom(),
        renderFooter(renderTFoot()),
      ]);
  },
});
