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
  // computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  provide,
  Ref,
  ref,
  SetupContext,
  watch,
  watchEffect,
} from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { debounce } from '@bkui-vue/shared';
import VirtualRender from '@bkui-vue/virtual-render';

import { ITableColumn } from './components/table-column';
import { PROVIDE_KEY_INIT_COL } from './const';
import { EMIT_EVENT_TYPES, EMIT_EVENTS } from './events';
import useColumnResize from './plugins/use-column-resize';
import useFixedColumn from './plugins/use-fixed-column';
import useObserverResize from './plugins/use-observer-resize';
import useScrollLoading from './plugins/use-scroll-loading';
import { Column, Settings, tableProps } from './props';
import useData from './use-attributes';
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

    const { columns, initColumns } = useColumn(props);
    const instance = getCurrentInstance();
    const initTableColumns = () => {
      initColumns(instance);
    };

    provide(PROVIDE_KEY_INIT_COL, initTableColumns);
    const tableSchema = useData(props);

    const { resizeColumnStyle, resizeHeadColStyle, registerResizeEvent } = useColumnResize(tableSchema, false, head);

    const {
      tableClass,
      headClass,
      footerClass,
      wrapperStyle,
      contentStyle,
      headStyle,
      hasFooter,
      footerStyle,
      tableBodyClass,
      resizeColumnClass,
      tableBodyContentClass,
      loadingRowClass,
      columnGhostStyle,
      fixedContainerStyle,
      scrollClass,
      prependStyle,
      resetTableHeight,
    } = useClass(props, columns as ITableColumn[], root, tableSchema, tableSchema.pageData);
    const { renderScrollLoading } = useScrollLoading(props, ctx);

    const { fixedWrapperClass, fixedColumns, resolveFixedColumns, updateFixClass } = useFixedColumn(
      props,
      tableSchema,
      head,
    );

    const { resolveClassName } = usePrefix();

    useObserverResize(root, () => {
      nextTick(() => {
        resolveFixedColumns(tableOffsetRight.value);
      });
    });

    const { renderTableBodySchema, renderTableFooter, renderTableHeadSchema } = useRender(
      props,
      ctx as SetupContext<any>,
      tableSchema,
      head,
      root,
      resetTableHeight,
    );

    const updateOffsetRight = () => {
      if (!root?.value) {
        return;
      }

      const $tableContent = root.value.querySelector(`.${resolveClassName('table-body-content')}`);
      const $table = $tableContent.querySelector('table');
      if ($table) {
        const $tableScrollWidth = $table.scrollWidth;
        const $contentWidth = $tableContent.clientWidth;
        tableOffsetRight.value = $tableScrollWidth - $contentWidth;
      }
    };

    const isFirstLoad = ref(true);

    watchEffect(() => {
      tableSchema.formatDataSchema(props.data);
      tableSchema.formatColumns(columns as Column[]);
      resolveFixedColumns(tableOffsetRight.value);
      tableSchema.setIndexData().then(() => {
        tableSchema.resetStartEndIndex();

        if (isFirstLoad.value) {
          tableSchema.resolveByDefColumns();
          isFirstLoad.value = false;
        } else {
          tableSchema.resolvePageData(tableSchema.getFilterFnList());
        }

        registerResizeEvent();
        nextTick(() => {
          updateOffsetRight();

          /**
           * 确保在所有数据渲染完毕再执行fix column计算
           */
          nextTick(() => {
            resetTableHeight(root.value);
          });
        });
      });
    });

    watch(
      () => [props.height, props.maxHeight, props.minHeight],
      () => {
        nextTick(() => {
          resetTableHeight(root.value);
        });
      },
    );

    watch(
      () => [props.settings],
      () => {
        tableSchema.updateSettings(props.settings as Settings);
      },
      { deep: true },
    );

    watch(
      () => [props.rowHeight],
      () => {
        tableSchema.updateSettings(undefined, props.rowHeight as number);
      },
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
        ref={root}
        style={wrapperStyle.value}
        class={tableClass.value}
      >
        {
          // @ts-ignore:next-line
          <div
            ref={head}
            style={headStyle.value}
            class={headClass}
          >
            {renderTableHeadSchema()}
            <div
              style={resizeHeadColStyle.value}
              class='col-resize-drag'
            ></div>
          </div>
        }
        <VirtualRender
          ref={refVirtualRender}
          height={contentStyle.height}
          class={tableBodyClass.value}
          lineHeight={tableSchema.formatData.settings.height}
          list={tableSchema.pageData}
          wrapperStyle={contentStyle}
          {...scrollClass.value}
          autoIndex={false}
          contentClassName={tableBodyContentClass.value}
          enabled={props.virtualEnabled}
          keepAlive={true}
          rowKey={props.rowKey}
          scrollEvent={true}
          scrollbar={{ enabled: true }}
          throttleDelay={120}
          onContentScroll={handleScrollChanged}
        >
          {{
            beforeContent: () => renderPrepend(),
            default: (scope: any) => renderTableBodySchema(scope.data),
            afterSection: () => [
              <div
                style={resizeColumnStyle.value}
                class={resizeColumnClass}
              ></div>,
            ],
          }}
        </VirtualRender>
        {/* @ts-ignore:next-line */}
        <div
          style={fixedContainerStyle.value}
          class={fixedWrapperClass}
        >
          {fixedColumns.map(({ isExist, className, style }) =>
            isExist ? (
              ''
            ) : (
              <div
                style={style}
                class={className}
              ></div>
            ),
          )}

          <div class={loadingRowClass}>{renderScrollLoading()}</div>
        </div>
        {/* @ts-ignore:next-line */}
        <div
          style={footerStyle.value}
          class={footerClass.value}
        >
          {hasFooter.value && renderTableFooter(tableSchema.localPagination.value)}
        </div>
        <div style={columnGhostStyle}>{ctx.slots.default?.()}</div>
      </div>
    );
  },
});
