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

import { computed, defineComponent, nextTick, provide, reactive, Ref, ref, SetupContext, watch } from 'vue';

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
  // eslint-disable-next-line vue/no-reserved-component-names
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
    const { initColumns, columns } = useColumn(props, targetColumns);
    const tableSchema: ITableResponse = useData(props);

    const { resizeColumnStyle, resizeHeadColStyle, registerResizeEvent } = useColumnResize(tableSchema, false, head);

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
      prependStyle,
    } = useClass(props, columns as ITableColumn[], root, tableSchema, tableSchema.pageData);
    const { renderScrollLoading } = useScrollLoading(props, ctx);

    const { fixedWrapperClass, fixedColumns, resolveFixedColumns, updateFixClass } = useFixedColumn(
      props,
      tableSchema,
      head,
    );

    const { resolveClassName } = usePrefix();

    const styleRef = computed(() => ({
      hasScrollY: hasScrollYRef.value,
    }));

    const { renderTableBodySchema, renderTableFooter, renderTableHeadSchema } = useRender(
      props,
      ctx as SetupContext<any>,
      tableSchema,
      styleRef,
      head,
    );

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
        tableSchema.formatColumns(columns as Column[]);
        tableSchema.formatDataSchema(props.data);
        tableSchema.resetStartEndIndex();
        tableSchema.resolvePageData();
        registerResizeEvent();
        nextTick(() => {
          updateOffsetRight();
          resolveFixedColumns(tableOffsetRight.value);
        });
      },
      { immediate: true, deep: true },
    );

    const handleScrollChanged = (args: any[]) => {
      const preBottom = tableSchema.formatData.layout.bottom ?? 0;
      const pagination = args[1];
      const { translateX, translateY, pos = {} } = pagination;
      tableSchema.formatData.layout.translateY = translateY;
      tableSchema.formatData.layout.translateX = translateX;
      Object.assign(tableSchema.formatData.layout, pos || {});
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
      updateFixClass(tableOffsetRight.value);
    };

    const scrollTo = (option = { left: 0, top: 0 }) => {
      refVirtualRender.value?.scrollTo?.(option);
    };

    const getRoot = () => root.value;

    ctx.expose({
      setRowExpand: tableSchema.setRowExpand,
      setAllRowExpand: tableSchema.setAllRowExpand,
      clearSelection: tableSchema.clearSelection,
      toggleAllSelection: tableSchema.toggleAllSelection,
      toggleRowSelection: tableSchema.toggleRowSelection,
      getSelection: tableSchema.getRowSelection,
      clearSort: tableSchema.clearColumnSort,
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
          lineHeight={tableSchema.formatData.settings.height}
          height={contentStyle.height}
          class={tableBodyClass.value}
          wrapperStyle={contentStyle}
          list={tableSchema.pageData}
          {...scrollClass.value}
          contentClassName={tableBodyContentClass.value}
          onContentScroll={handleScrollChanged}
          throttleDelay={120}
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
          {fixedColumns.map(({ isExist, className, style }) =>
            isExist ? (
              ''
            ) : (
              <div
                class={className}
                style={style}
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
          {hasFooter.value && renderTableFooter(tableSchema.localPagination.value)}
        </div>
        <div style={columnGhostStyle}>{ctx.slots.default?.()}</div>
      </div>
    );
  },
});
