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
  provide,
  reactive,
  Ref,
  ref,
  watch,
} from 'vue';

import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import { debounce } from '@bkui-vue/shared';
import VirtualRender from '@bkui-vue/virtual-render';

import BkTableCache from './cache';
import {
  PROVIDE_KEY_INIT_COL,
  PROVIDE_KEY_TB_CACHE,
  SCROLLY_WIDTH,
} from './const';
import { EMIT_EVENT_TYPES, EMIT_EVENTS, EVENTS } from './events';
import useScrollLoading from './plugins/use-scroll-loading';
import { Column, tableProps } from './props';
import TableRender from './render';
import useColumn from './use-column';
import { useClass } from './use-common';
import useData, { ITableResponse } from './use-attributes';
import useFixedColumn from './plugins/use-fixed-column';
import useColumnResize from './plugins/use-column-resize';
import { ITableColumn } from './components/table-column';

export default defineComponent({
  name: 'Table',
  props: tableProps,
  emits: EMIT_EVENT_TYPES,
  setup(props, ctx) {
    const t = useLocale('table');

    const root: Ref<HTMLElement> = ref();
    const head: Ref<HTMLElement> = ref();
    const refVirtualRender = ref();
    // scrollX 右侧距离
    const tableOffsetRight = ref(0);

    const bkTableCache = new BkTableCache();
    const targetColumns = reactive([]);
    const { initColumns, getColumns } = useColumn(props, targetColumns);
    const columns = getColumns();
    const TableSchema: ITableResponse = useData(props);

    const { dragOffsetX, dragOffsetXStyle, registerResizeEvent } = useColumnResize(TableSchema, false, head);


    provide(PROVIDE_KEY_INIT_COL, initColumns);
    provide(PROVIDE_KEY_TB_CACHE, bkTableCache);

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
      hasFooter,
    } = useClass(props, columns as ITableColumn[], root, TableSchema, TableSchema.pageData);

    const {
      fixedWrapperClass,
      fixedColumns,
      resolveColumnStyle,
      resolveColumnClass,
    } = useFixedColumn(props, TableSchema);

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

    watch(() => [props.data, columns], () => {
      TableSchema.formatDataSchema(props.data);
      TableSchema.resolvePageData();
      TableSchema.formatColumns(columns as Column[]);
      registerResizeEvent();
    }, { immediate: true });


    /**
     * 监听Table 派发的相关事件
     */
    tableRender.on(EVENTS.ON_SETTING_CHANGE, (args: any) => {
      const { checked = [], size, height, fields } = args;
      nextTick(() => {
        updateBorderClass(root.value);
        ctx.emit(EMIT_EVENTS.SETTING_CHANGE, { checked, size, height, fields });
      });
    });

    const handleScrollChanged = (args: any[]) => {
      const preBottom = TableSchema.formatData.layout.bottom ?? 0;
      const pagination = args[1];
      const { translateX, translateY, pos = {} } = pagination;
      TableSchema.formatData.layout.translateY = translateY;
      TableSchema.formatData.layout.translateX = translateX;
      Object.assign(TableSchema.formatData.layout, pos || {});
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
      getSelection: TableSchema.getRowSelection,
      clearSort: TableSchema.clearColumnSort,
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
      left: `${dragOffsetX.value - TableSchema.formatData.layout.translateX}px`,
    }));

    const resizeHeadColStyle = computed(() => ({
      ...dragOffsetXStyle.value,
      width: '6px',
      left: `${dragOffsetX.value - TableSchema.formatData.layout.translateX}px`,
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
      '--prepend-left': `${TableSchema.formatData.layout.translateX}px`,
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
                class={resolveColumnClass(column, TableSchema.formatData.layout.translateX, tableOffsetRight.value)}
                style={resolveColumnStyle(colPos)}
              ></div>
            ),
          )}
          <div class={resizeColumnClass} style={resizeColumnStyle.value}></div>
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
