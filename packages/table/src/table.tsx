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

import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, provide, reactive, ref, watch, watchEffect } from 'vue';

import { debounce, resolveClassName } from '@bkui-vue/shared';
import VirtualRender from '@bkui-vue/virtual-render';

import { EMIT_EVENT_TYPES, EMIT_EVENTS, EVENTS, PROVIDE_KEY_INIT_COL, TABLE_ROW_ATTRIBUTE } from './const';
import usePagination from './plugins/use-pagination';
import useScrollLoading from './plugins/use-scroll-loading';
import { tableProps } from './props';
import TableRender from './render';
import useColumn from './use-column';
import { useClass, useInit } from './use-common';
import {
  observerResize,
  resolveColumnWidth,
} from './utils';

export default defineComponent({
  name: 'Table',
  props: tableProps,
  emits: EMIT_EVENT_TYPES,
  setup(props, ctx) {
    let columnSortFn: any = null;
    let activeSortColumn: any = null;
    let columnFilterFn: any = null;

    let observerIns = null;
    const targetColumns = reactive([]);
    const { initColumns } = useColumn(props, targetColumns);
    provide(PROVIDE_KEY_INIT_COL, initColumns);

    const root = ref();
    const refVirtualRender = ref();
    // scrollX 右侧距离
    const tableOffsetRight = ref(0);
    const {
      colgroups,
      dragOffsetXStyle,
      dragOffsetX,
      reactiveSchema,
      indexData,
      renderFixedColumns,
      setRowExpand,
      initIndexData,
      fixedWrapperClass,
      clearSelection,
      toggleAllSelection,
      toggleRowSelection,
      getSelection,
      clearSort,
    } = useInit(props, targetColumns);

    const { pageData, localPagination, resolvePageData, watchEffectFn } = usePagination(props, indexData);
    const {
      tableClass,
      headClass,
      contentClass,
      footerClass,
      wrapperStyle,
      contentStyle,
      headStyle,
      updateBorderClass,
      resetTableHeight,
      getColumnsWidthOffsetWidth,
      hasFooter,
    } = useClass(props, targetColumns, root, reactiveSchema, pageData);

    const tableRender = new TableRender(props, ctx, reactiveSchema, colgroups);

    const updateOffsetRight = () => {
      const $tableContent = root.value.querySelector('.bk-table-body-content');
      const $table = $tableContent.querySelector('table');
      if ($table) {
        const $tableScrollWidth = $table.scrollWidth;
        const $contentWidth = $tableContent.clientWidth;
        tableOffsetRight.value = $tableScrollWidth - $contentWidth;
      }
    };

    watch(() => [props.data, props.pagination, props.height, props.maxHeight, props.minHeight], () => {
      initIndexData(props.reserveExpand);
      watchEffectFn(columnFilterFn, columnSortFn, activeSortColumn);
      nextTick(() => {
        resetTableHeight(root.value);
        updateBorderClass(root.value);
      });
    }, { immediate: true, deep: true });

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
        resolvePageData(columnFilterFn, columnSortFn, activeSortColumn);
        refVirtualRender.value?.reset?.();
      }

      ctx.emit(EMIT_EVENTS.COLUMN_SORT, { column, index, type });
    }).on(EVENTS.ON_FILTER_CLICK, (args: any) => {
      const { filterFn, checked, column, index } = args;
      if (typeof filterFn === 'function') {
        columnFilterFn = filterFn;
        resolvePageData(columnFilterFn, columnSortFn, activeSortColumn);
        refVirtualRender.value?.reset?.();
      }

      ctx.emit(EMIT_EVENTS.COLUMN_FILTER, { checked, column, index });
    })
      .on(EVENTS.ON_SETTING_CHANGE, (args: any) => {
        const { checked = [], size, height } = args;
        nextTick(() => {
          updateBorderClass(root.value);
          const offset = getColumnsWidthOffsetWidth();
          checked.length && resolveColumnWidth(root.value, colgroups, 20, offset);
          refVirtualRender.value?.reset?.();
          ctx.emit(EMIT_EVENTS.SETTING_CHANGE, { checked, size, height });
        });
      })
      .on(EVENTS.ON_ROW_EXPAND_CLICK, (args: any) => {
        const { row, column, index, rows, e } = args;
        ctx.emit(EMIT_EVENTS.ROW_EXPAND_CLICK, {
          row: row[TABLE_ROW_ATTRIBUTE.ROW_SOURCE_DATA],
          column, index, rows, e,
        });
        setRowExpand(row, !row[TABLE_ROW_ATTRIBUTE.ROW_EXPAND]);
      })
      .on(EVENTS.ON_ROW_CHECK, ({ row, isAll, index, value }) => {
        if (isAll) {
          toggleAllSelection(value);
          ctx.emit(EMIT_EVENTS.ROW_SELECT_ALL, { checked: value, data: props.data });
        } else {
          toggleRowSelection(row, value);
          ctx.emit(EMIT_EVENTS.ROW_SELECT, {
            row: row[TABLE_ROW_ATTRIBUTE.ROW_SOURCE_DATA],
            index,
            checked: value,
            data: props.data,
          });
        }

        ctx.emit(EMIT_EVENTS.ROW_SELECT_CHANGE, {
          row: row[TABLE_ROW_ATTRIBUTE.ROW_SOURCE_DATA],
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
      reactiveSchema.scrollTranslateY = translateY;
      reactiveSchema.scrollTranslateX = translateX;
      reactiveSchema.pos = pos;
      const { bottom } = pos;
      if (bottom <= 2 && preBottom > bottom) {
        debounce(60, () => {
          ctx.emit(EMIT_EVENTS.SCROLL_BOTTOM, { ...pos, translateX, translateY });
        }, true)();
      }

      updateOffsetRight();
    };

    onMounted(() => {
      observerIns = observerResize(root.value, () => {
        if (props.height === '100%' || props.height === 'auto') {
          resetTableHeight(root.value);
        }

        updateBorderClass(root.value);
        const offset = getColumnsWidthOffsetWidth();
        resolveColumnWidth(root.value, colgroups, 20, offset);
      }, 60, true);

      observerIns.start();
    });

    onBeforeUnmount(() => {
      observerIns.stop();
      observerIns = null;
      tableRender.destroy();
    });

    ctx.expose({
      setRowExpand,
      clearSelection,
      toggleAllSelection,
      toggleRowSelection,
      getSelection,
      clearSort,
    });

    const tableBodyClass = computed(() => ({
      ...contentClass,
      '__is-empty': !pageData.length,
    }));

    const tableBodyContentClass = computed(() => ({
      [resolveClassName('table-body-content')]: true,
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

    const { renderScrollLoading } = useScrollLoading(props, ctx);
    const scrollClass = computed(() => (props.virtualEnabled ? {} : { scrollXName: '', scrollYName: '' }));

    return () => <div class={tableClass.value} style={wrapperStyle.value} ref={root}>
      {
        // @ts-ignore:next-line
        <div class={ headClass } style={headStyle.value}>
        {
          tableRender.renderTableHeadSchema()
        }
      </div>
      }
      <VirtualRender
        ref={refVirtualRender}
        lineHeight={tableRender.getRowHeight}
        class={ tableBodyClass.value }
        style={ contentStyle }
        list={ pageData }
        { ...scrollClass.value }
        contentClassName={ tableBodyContentClass.value }
        onContentScroll={ handleScrollChanged }
        throttleDelay={0}
        scrollEvent={true}
        enabled={props.virtualEnabled}>
          {
            {
              default: (scope: any) => tableRender.renderTableBodySchema(scope.data || props.data),
              afterSection: () => <div class={ fixedBottomBorder.value }></div>,
            }
          }
      </VirtualRender>
      <div class={ fixedWrapperClass }>
        { renderFixedColumns(reactiveSchema.scrollTranslateX, tableOffsetRight.value) }
        <div class={ resizeColumnClass } style={ resizeColumnStyle.value }></div>
        <div class={ loadingRowClass }>{
          renderScrollLoading()
        }</div>
      </div>
      <div class={ footerClass.value }>
        {
          hasFooter.value && tableRender.renderTableFooter(localPagination.value)
        }
      </div>
      <div style={columnGhostStyle}>{ ctx.slots.default?.() }</div>
    </div>;
  },
});

