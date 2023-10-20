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

import { computed, defineComponent, provide, reactive, Ref, ref, SetupContext, watch } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { debounce } from '@bkui-vue/shared';
import VirtualRender from '@bkui-vue/virtual-render';

import BkTableCache from './cache';
import { ITableColumn } from './components/table-column';
import { PROVIDE_KEY_INIT_COL, PROVIDE_KEY_TB_CACHE } from './const';
import { EMIT_EVENT_TYPES, EMIT_EVENTS } from './events';
import useColumnResize from './plugins/use-column-resize';
import useFixedColumn from './plugins/use-fixed-column';
import useScrollLoading from './plugins/use-scroll-loading';
import { Column, tableProps } from './props';
import useData, { ITableResponse } from './use-attributes';
import useColumn from './use-column';
import { useClass } from './use-common';
import useRender from './use-render';

export default defineComponent({
  name: 'Table',
  props: tableProps,
  emits: EMIT_EVENT_TYPES,
  setup(props, ctx) {
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

    const { resizeColumnStyle, resizeHeadColStyle, registerResizeEvent } = useColumnResize(TableSchema, false, head);

    provide(PROVIDE_KEY_INIT_COL, initColumns);
    provide(PROVIDE_KEY_TB_CACHE, bkTableCache);

    const {
      tableClass,
      headClass,
      footerClass,
      wrapperStyle,
      contentStyle,
      headStyle,
      hasScrollYRef,
      hasFooter,
      footerStyle,
      tableBodyClass,
      fixedBottomBorder,
      resizeColumnClass,
      tableBodyContentClass,
      loadingRowClass,
      columnGhostStyle,
      fixedContainerStyle,
      scrollClass,
      prependStyle
    } = useClass(props, columns as ITableColumn[], root, TableSchema, TableSchema.pageData);
    const { renderScrollLoading } = useScrollLoading(props, ctx);

    const { fixedWrapperClass, fixedColumns, resolveColumnStyle, resolveColumnClass } = useFixedColumn(
      props,
      TableSchema,
    );

    const { resolveClassName } = usePrefix();

    const styleRef = computed(() => ({
      hasScrollY: hasScrollYRef.value,
    }));

    const { renderTableBodySchema, renderTableFooter, renderTableHeadSchema } = useRender(props, ctx as SetupContext<any>, TableSchema, styleRef);

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
      () => [props.data, columns],
      () => {
        TableSchema.formatDataSchema(props.data);
        TableSchema.resetStartEndIndex();
        TableSchema.resolvePageData();
        TableSchema.formatColumns(columns as Column[]);
        registerResizeEvent();
      },
      { immediate: true, deep: true },
    );

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
            {renderTableHeadSchema()}
            <div
              class='col-resize-drag'
              style={resizeHeadColStyle.value}
            ></div>
          </div>
        }
        <VirtualRender
          ref={refVirtualRender}
          lineHeight={TableSchema.formatData.settings.height}
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
            default: (scope: any) => renderTableBodySchema(scope.data),
            afterSection: () => [
              <div class={fixedBottomBorder.value}></div>,
              <div
                class={resizeColumnClass}
                style={resizeColumnStyle.value}
              ></div>,
            ],
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

          <div class={loadingRowClass}>{renderScrollLoading()}</div>
        </div>
        {/* @ts-ignore:next-line */}
        <div
          class={footerClass.value}
          style={footerStyle.value}
        >
          {hasFooter.value && renderTableFooter(TableSchema.localPagination.value)}
        </div>
        <div style={columnGhostStyle}>{ctx.slots.default?.()}</div>
      </div>
    );
  },
});
