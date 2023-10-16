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

import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  Ref,
  ref,
  unref,
  watch,
  watchEffect,
} from 'vue';

import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import { debounce } from '@bkui-vue/shared';
import VirtualRender from '@bkui-vue/virtual-render';

import BkTableCache from './cache';
import {
  COL_MIN_WIDTH,
  COLUMN_ATTRIBUTE,
  PROVIDE_KEY_INIT_COL,
  PROVIDE_KEY_TB_CACHE,
  SCROLLY_WIDTH,
  SORT_OPTION,
  TABLE_ROW_ATTRIBUTE,
} from './const';
import { EMIT_EVENT_TYPES, EMIT_EVENTS, EVENTS } from './events';
import usePagination from './plugins/use-pagination';
import useScrollLoading from './plugins/use-scroll-loading';
import { IColSortBehavior, tableProps } from './props';
import TableRender from './render';
import useColumn from './use-column';
import { useClass } from './use-common';
import { getColumnSourceData, getRowSourceData, observerResize, resolveColumnWidth, resolvePropVal } from './utils';
import useData, { ITableResponse } from './use-data';

export default defineComponent({
  name: 'Table',
  props: tableProps,
  emits: EMIT_EVENT_TYPES,
  setup(props, ctx) {
    const t = useLocale('table');

    let columnSortFn: any = null;
    let columnFilterFn: any = null;
    const bkTableCache = new BkTableCache();
    const TableSchema: ITableResponse = useData(props);

    const targetColumns = reactive([]);
    const { initColumns, getActiveColumn } = useColumn(props, targetColumns);
    provide(PROVIDE_KEY_INIT_COL, initColumns);
    provide(PROVIDE_KEY_TB_CACHE, bkTableCache);

    let activeSortColumn: any = getActiveColumn();

    const root: Ref<HTMLElement> = ref();
    const head: Ref<HTMLElement> = ref();
    const refVirtualRender = ref();
    // scrollX 右侧距离
    const tableOffsetRight = ref(0);

    const {
      tableClass,
      headClass,
      contentClass,
      footerClass,
      wrapperStyle,
      contentStyle,
      headStyle,
      hasScrollYRef,
      fixHeight,
      maxFixHeight,
      updateBorderClass,
      resetTableHeight,
      getColumnsWidthOffsetWidth,
      hasFooter,
    } = useClass(props, targetColumns, root, TableSchema, TableSchema.pageData);

    const { resolveClassName } = usePrefix();

    const styleRef = computed(() => ({
      hasScrollY: hasScrollYRef.value,
    }));
    const tableRender = new TableRender(props, ctx, TableSchema, styleRef, t);

    const updateOffsetRight = () => {
      const $tableContent = root.value.querySelector(`.${resolveClassName('table-body-content')}`);
      const $table = $tableContent.querySelector('table');
      if ($table) {
        const $tableScrollWidth = $table.scrollWidth;
        const $contentWidth = $tableContent.clientWidth;
        tableOffsetRight.value = $tableScrollWidth - $contentWidth;
      }
    };

    watch(
      () => [props.data, props.pagination, props.height, props.maxHeight, props.minHeight],
      () => {
        TableSchema.formatDataSchema(props.data);
        TableSchema.watchEffectFn(columnFilterFn, columnSortFn, activeSortColumn);

        nextTick(() => {
          resetTableHeight(root.value);
          updateBorderClass(root.value);
        });
      },
      { immediate: true, deep: true },
    );

    watch(() => [targetColumns], () => {
      TableSchema.formatColumns(targetColumns);
    });

    /**
     * 保证每次计算宽度正确
     */
    watchEffect(() => {
      if (root?.value instanceof HTMLElement) {
        const offset = getColumnsWidthOffsetWidth();
        resolveColumnWidth(root.value, colgroups, 20, offset);
        updateOffsetRight();
      }
    });

    /**
     * 监听Table 派发的相关事件
     */
    tableRender.on(EVENTS.ON_SORT_BY_CLICK, (args: any) => {
      const { sortFn, column, index, type } = args;
      if (typeof sortFn === 'function') {
        columnSortFn = sortFn;
        activeSortColumn = column;
        TableSchema.resolvePageData(columnFilterFn, columnSortFn, column, type);
      }

      ctx.emit(EMIT_EVENTS.COLUMN_SORT, { column: unref(column[COLUMN_ATTRIBUTE.COL_SOURCE_DATA]), index, type });
    })
      .on(EVENTS.ON_FILTER_CLICK, (args: any) => {
        const { filterFn, checked, column, index } = args;
        if (typeof filterFn === 'function') {
          columnFilterFn = filterFn;
          TableSchema.resolvePageData(columnFilterFn, columnSortFn, column, TableSchema.getColumnAttributeValue(column, COLUMN_ATTRIBUTE.COL_SORT_TYPE) as string);
          // refVirtualRender.value?.reset?.();
        }

        ctx.emit(EMIT_EVENTS.COLUMN_FILTER, {
          checked,
          column: unref(column[COLUMN_ATTRIBUTE.COL_SOURCE_DATA]),
          index,
        });
      })
      .on(EVENTS.ON_SETTING_CHANGE, (args: any) => {
        const { checked = [], size, height, fields } = args;
        nextTick(() => {
          // updateColGroups({ checked, fields });
          updateBorderClass(root.value);
          const offset = getColumnsWidthOffsetWidth();
          checked.length && resolveColumnWidth(root.value, colgroups, COL_MIN_WIDTH, offset);
          // refVirtualRender.value?.reset?.();
          ctx.emit(EMIT_EVENTS.SETTING_CHANGE, { checked, size, height, fields });
        });
      })
      .on(EVENTS.ON_ROW_EXPAND_CLICK, (args: any) => {
        const { row, column, index, rows, e } = args;
        ctx.emit(EMIT_EVENTS.ROW_EXPAND_CLICK, {
          row,
          column,
          index,
          rows,
          e,
        });
        TableSchema.setRowExpand(row, TableSchema.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_EXPAND));
      })
      .on(EVENTS.ON_ROW_CHECK, ({ row, isAll, index, value }) => {
        if (isAll) {
          TableSchema.toggleAllSelection();
          ctx.emit(EMIT_EVENTS.ROW_SELECT_ALL, { checked: value, data: props.data });
        } else {
          TableSchema.toggleRowSelection(row);
          ctx.emit(EMIT_EVENTS.ROW_SELECT, {
            row,
            index,
            checked: value,
            data: props.data,
          });
        }

        ctx.emit(EMIT_EVENTS.ROW_SELECT_CHANGE, {
          row: getRowSourceData(row),
          isAll,
          index,
          checked: value,
          data: props.data,
        });
      });

    const handleScrollChanged = (args: any[]) => {
      const preBottom = reactiveSchema.pos.bottom ?? 0;
      const pagination = args[1];
      const { translateX, translateY, pos = {} } = pagination;
      TableSchema.formatData.scrollTranslateY = translateY;
      TableSchema.formatData.scrollTranslateX = translateX;
      reactiveSchema.pos = pos;
      const { bottom } = pos;
      if (bottom <= 2 && preBottom > bottom) {
        debounce(
          60,
          () => {
            ctx.emit(EMIT_EVENTS.SCROLL_BOTTOM, { ...pos, translateX, translateY });
          },
          true,
        )();
      }

      updateOffsetRight();
    };

    const scrollTo = (option = { left: 0, top: 0 }) => {
      refVirtualRender.value?.scrollTo?.(option);
    };

    onMounted(() => {
      if (props.observerResize) {
        let observerIns = observerResize(
          root.value,
          () => {
            if (!root.value) {
              return;
            }
            if (props.height === '100%' || props.height === 'auto') {
              resetTableHeight(root.value);
            }

            updateBorderClass(root.value);
            const offset = getColumnsWidthOffsetWidth();
            resolveColumnWidth(root.value, colgroups, 20, offset);
          },
          180,
          true,
          props.resizerWay,
        );

        observerIns.start();
        onBeforeUnmount(() => {
          observerIns.disconnect();
          observerIns = null;
        });
      }
    });

    onBeforeUnmount(() => {
      tableRender.destroy();
    });

    const getRoot = () => root.value;

    ctx.expose({
      setRowExpand: TableSchema.setRowExpand,
      setAllRowExpand: TableSchema.setAllRowExpand,
      clearSelection: TableSchema.clearSelection,
      toggleAllSelection: TableSchema.toggleAllSelection,
      toggleRowSelection: TableSchema.toggleRowSelection,
      getSelection,
      clearSort,
      scrollTo,
      getRoot,
    });

    const tableBodyClass = computed(() => ({
      ...contentClass,
      '__is-empty': !TableSchema.pageData.length,
    }));

    const tableBodyContentClass = computed(() => ({
      [resolveClassName('table-body-content')]: true,
      [resolveClassName('stripe')]: props.stripe,
      'with-virtual-render': props.virtualEnabled,
    }));

    const resizeColumnClass = {
      column_drag_line: true,
      'offset-x': true,
    };

    const resizeColumnStyle = computed(() => ({
      ...dragOffsetXStyle.value,
      left: `${dragOffsetX.value - reactiveSchema.scrollTranslateX}px`,
    }));

    const resizeHeadColStyle = computed(() => ({
      ...dragOffsetXStyle.value,
      width: '6px',
      left: `${dragOffsetX.value - reactiveSchema.scrollTranslateX}px`,
    }));

    const loadingRowClass = {
      'scroll-loading': true,
      _bottom: true,
    };

    const fixedBottomBorder = computed(() => ({
      [resolveClassName('fixed-bottom-border')]: true,
      '_is-empty': !props.data.length,
    }));

    const columnGhostStyle = {
      zIndex: -1,
      width: 0,
      height: 0,
      display: 'none' as const,
    };

    const footerStyle = computed(() => ({
      '--footer-height': hasFooter.value ? `${props.paginationHeight}px` : '0',
    }));

    const fixedContainerStyle = computed(() => ({
      right: hasScrollYRef.value ? `${SCROLLY_WIDTH}px` : 0,
      '--fix-height': `${fixHeight.value}px`,
      '--fix-max-height': `${maxFixHeight.value}px`,
      ...footerStyle.value,
    }));

    const { renderScrollLoading } = useScrollLoading(props, ctx);
    const scrollClass = computed(() => (props.virtualEnabled ? {} : { scrollXName: '', scrollYName: '' }));

    const prependStyle = computed(() => ({
      '--prepend-left': `${TableSchema.formatData.scrollTranslateX}px`,
      position: 'sticky' as const,
      top: 0,
      zIndex: 2,
      ...(props.prependStyle || {}),
    }));


    const renderPrepend = () => {
      if (ctx.slots.prepend) {
        return (
          <div
            style={prependStyle.value}
            class='prepend-row'
          >
            {ctx.slots.prepend()}
          </div>
        );
      }

      return null;
    };

    return () => (
      <div
        class={tableClass.value}
        style={wrapperStyle.value}
        ref={root}
      >
        {
          // @ts-ignore:next-line
          <div
            class={headClass}
            style={headStyle.value}
            ref={head}
          >
            {tableRender.renderTableHeadSchema()}
            <div
              class='col-resize-drag'
              style={resizeHeadColStyle.value}
            ></div>
          </div>
        }
        <VirtualRender
          ref={refVirtualRender}
          lineHeight={tableRender.getRowHeight}
          height={contentStyle.height}
          class={tableBodyClass.value}
          wrapperStyle={contentStyle}
          list={TableSchema.pageData}
          {...scrollClass.value}
          contentClassName={tableBodyContentClass.value}
          onContentScroll={handleScrollChanged}
          throttleDelay={0}
          scrollEvent={true}
          rowKey={props.rowKey}
          enabled={props.virtualEnabled}
          keepAlive={true}
        >
          {{
            beforeContent: () => renderPrepend(),
            default: (scope: any) => tableRender.renderTableBodySchema(scope.data || TableSchema.pageData),
            afterSection: () => <div class={fixedBottomBorder.value}></div>,
          }}
        </VirtualRender>
        {/* @ts-ignore:next-line */}
        <div
          class={fixedWrapperClass}
          style={fixedContainerStyle.value}
        >
          {fixedColumns.value.map(({ isExist, colPos, column }) =>
            isExist ? (
              ''
            ) : (
              <div
                class={resolveColumnClass(column, TableSchema.formatData.scrollTranslateX, tableOffsetRight.value)}
                style={resolveColumnStyle(colPos)}
              ></div>
            ),
          )}
          <div
            class={resizeColumnClass}
            style={resizeColumnStyle.value}
          ></div>
          <div class={loadingRowClass}>{renderScrollLoading()}</div>
        </div>
        {/* @ts-ignore:next-line */}
        <div
          class={footerClass.value}
          style={footerStyle.value}
        >
          {hasFooter.value && tableRender.renderTableFooter(TableSchema.localPagination.value)}
        </div>
        <div style={columnGhostStyle}>{ctx.slots.default?.()}</div>
      </div>
    );
  },
});
