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
import { computed, onMounted, reactive, Ref, ref } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { classes, throttle } from '@bkui-vue/shared';
import VirtualRender from '@bkui-vue/virtual-render';
import { debounce } from 'lodash';

import GhostBody from '../components/ghost-body';
import { DEF_COLOR, IHeadColor, LINE_HEIGHT, SCROLLY_WIDTH } from '../const';
import { EMIT_EVENTS } from '../events';
import { Column, TablePropTypes } from '../props';
import { resolveHeadConfig, resolveNumberOrStringToPix, resolvePropBorderToClassStr, resolvePropVal } from '../utils';
import useScrollLoading from './use-scroll-loading';

export default (props: TablePropTypes, ctx) => {
  const refRoot: Ref<HTMLElement> = ref(null);
  const refHead: Ref<HTMLElement> = ref(null);

  const refBody = ref(null);
  const refFooter = ref(null);
  const translateX = ref(0);
  const translateY = ref(0);
  const preBottom = ref(0);
  const dragOffsetX = ref(-10000);
  const offsetRight = ref(0);
  const layout: { bottom?: number } = reactive({});
  const fixedColumns = reactive([]);
  const lineHeight = ref(LINE_HEIGHT);
  const headerRowCount = ref(1);

  const fixedBottomHeight = computed(() => {
    if (ctx.slots?.fixedBottom) {
      return props.fixedBottom?.position === 'relative' ? props.fixedBottom?.height ?? LINE_HEIGHT : 0;
    }

    return 0;
  });

  const { resolveClassName } = usePrefix();
  const { renderScrollLoading } = useScrollLoading(props, ctx);

  const tableClass = computed(() =>
    classes(
      {
        [resolveClassName('table')]: true,
      },
      resolvePropBorderToClassStr(props.border),
    ),
  );

  const tableStyle = computed(() => ({
    height: resolveNumberOrStringToPix(props.height),
    maxHeight: resolveNumberOrStringToPix(props.maxHeight),
    minHeight: resolveNumberOrStringToPix(props.minHeight),
  }));

  const headClass = computed(() =>
    classes({
      [resolveClassName('table-head')]: true,
      'has-settings': !!props.settings,
      'has-group': headerRowCount.value > 1,
    }),
  );

  const setFixedColumnShawdow = () => {
    const rightShawdow = offsetRight.value > 0 ? '0 0 10px rgb(0 0 0 / 12%)' : null;
    const leftShawdow = translateX.value > 0 ? '0 0 10px rgb(0 0 0 / 12%)' : null;
    refRoot.value?.style?.setProperty('--shadow-right', rightShawdow);
    refRoot.value?.style?.setProperty('--shadow-left', leftShawdow);
  };

  const setRootStyleVars = throttle(() => {
    refRoot.value?.style?.setProperty('--drag-offset-x', `${dragOffsetX.value + translateX.value}px`);
    refRoot.value?.style?.setProperty('--drag-offset-h-x', `${dragOffsetX.value - 2}px`);
    refRoot.value?.style?.setProperty('--translate-y', `${translateY.value}px`);
    refRoot.value?.style?.setProperty('--translate-x', `${translateX.value}px`);
    refRoot.value?.style?.setProperty('--translate-x-1', `-${translateX.value}px`);
    setFixedColumnShawdow();
  });

  const setTranslateX = (val: number) => {
    translateX.value = val;
    setRootStyleVars();
  };

  const setHeaderRowCount = (val: number) => {
    headerRowCount.value = val;
  };

  const setTranslateY = (val: number) => {
    translateY.value = val;
    setRootStyleVars();
  };

  const initRootStyleVars = () => {
    refRoot.value?.style?.setProperty('--drag-offset-x', '-1000px');
    refRoot.value?.style?.setProperty('--drag-offset-h-x', '-1000px');
    refRoot.value?.style?.setProperty('--translate-y', '0px');
    refRoot.value?.style?.setProperty('--translate-x', '0px');
    refRoot.value?.style?.setProperty('--translate-x-1', '0px');
  };

  const setDragOffsetX = (val: number) => {
    dragOffsetX.value = val;
    setRootStyleVars();
  };

  const config = resolveHeadConfig(props);
  const headHeight = computed(() => resolvePropVal(config, 'height', ['thead']) * headerRowCount.value);

  const headStyle = computed(() => ({
    '--row-height': `${headHeight.value}px`,
    '--background-color': DEF_COLOR[props.thead?.color ?? IHeadColor.DEF1],
    paddingRight: props.scrollbar ? null : `${SCROLLY_WIDTH}px`,
  }));

  const bodyClass = {
    [resolveClassName('table-body')]: true,
    ['is-bk-scrollbar']: props.scrollbar,
  };

  const footerClass = computed(() =>
    classes({
      [resolveClassName('table-footer')]: true,
      ['is-hidden']: footHeight.value === 0,
    }),
  );

  const renderContainer = childrend => {
    return (
      <div
        ref={refRoot}
        style={tableStyle.value}
        class={tableClass.value}
      >
        {childrend}
        <GhostBody>{ctx.slots.default?.()}</GhostBody>
      </div>
    );
  };
  const renderHeader = (childrend?, settings?, fixedRows?) => {
    return (
      <div
        ref={refHead}
        style={headStyle.value}
        class={headClass.value}
      >
        {childrend?.()}
        <div class='col-resize-drag'></div>
        <div class={fixedWrapperClass}>{fixedRows?.()}</div>
        {settings?.()}
      </div>
    );
  };

  const prependStyle = computed(() => ({
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

  const bodyHeight: Ref<number | string> = ref('auto');

  const bodyMaxHeight = computed(() => {
    if (/^\d+\.?\d*(px|%)$/.test(`${tableStyle.value.maxHeight}`)) {
      const headerHeight = props.showHead ? headHeight.value : 0;
      const delHeight = footHeight.value + headerHeight + fixedBottomHeight.value;

      return `calc(${tableStyle.value.maxHeight} - ${delHeight}px)`;
    }

    return null;
  });

  const getBodyHeight = height => {
    return height - headHeight.value - fixedBottomHeight.value - footHeight.value;
  };

  const setBodyHeight = (height: number, withHeadFoot = true) => {
    if (withHeadFoot) {
      bodyHeight.value = getBodyHeight(height);
      return;
    }

    bodyHeight.value = height;
  };

  const setVirtualBodyHeight = (height: number) => {
    bodyHeight.value = height;
  };

  const footHeight = ref(0);
  const footerStyle = computed(() => ({
    '--footer-height': `${footHeight.value}px`,
  }));
  const setFootHeight = (height: number) => {
    footHeight.value = height;
  };

  const emitScrollBottom = debounce((...args) => {
    ctx.emit(EMIT_EVENTS.SCROLL_BOTTOM, { ...args });
  });

  /**
   * 设置横向滚动条距离右侧距离
   * 用于判定fix column的显示样式
   */
  const setOffsetRight = () => {
    const scrollWidth = refBody.value?.refRoot?.scrollWidth ?? 0;
    const offsetWidth = refBody.value?.refRoot?.offsetWidth ?? 0;
    offsetRight.value = scrollWidth - offsetWidth - translateX?.value ?? 0;
  };

  const setLineHeight = (val: ((...args) => number) | number) => {
    lineHeight.value = val as number;
  };

  const handleScrollChanged = (
    args: ({ translateX: number; translateY: number; pos: Record<string, number> } | Record<string, number> | number)[],
  ) => {
    preBottom.value = layout.bottom ?? 0;
    const pagination = args[1];
    const {
      translateX,
      translateY,
      pos = {},
    } = pagination as {
      translateX: number;
      translateY: number;
      pos: Record<string, number>;
    };
    setTranslateX(translateX);
    setTranslateY(translateY);
    setOffsetRight();
    Object.assign(layout, pos || {});
    const { bottom } = pos;
    if (bottom <= 2 && preBottom.value > bottom) {
      emitScrollBottom({ ...pos, translateX, translateY });
    }
  };

  const resizeColumnClass = {
    column_drag_line: true,
    'offset-x': true,
    'resize-column': true,
  };

  const scrollContentClass = computed(() => {
    return {
      [resolveClassName('table-body-content')]: true,
      [resolveClassName('stripe')]: props.stripe,
    };
  });

  const fixedWrapperClass = computed(() => {
    return {
      [resolveClassName('table-fixed')]: true,
      'has-virtual-scroll': props.virtualEnabled,
    };
  });

  const fixedBottomRow = resolveClassName('table-fixed-bottom');

  const fixedBottomLoadingStyle = computed(() => ({
    minHeight: `${props.fixedBottom?.minHeight ?? LINE_HEIGHT}px`,
    position: props.fixedBottom?.position ?? 'absolute',
    height: props.fixedBottom?.height ?? null,
  }));

  onMounted(() => {
    setOffsetRight();
    initRootStyleVars();
  });

  const getFixedBottomRender = () => {
    const result = renderScrollLoading?.();
    if (result) {
      return (
        <div
          style={fixedBottomLoadingStyle.value}
          class={fixedBottomRow}
        >
          {result}
        </div>
      );
    }

    return null;
  };

  const renderBody = (list, childrend?, fixedRows?) => {
    return (
      <VirtualRender
        ref={refBody}
        height={bodyHeight.value}
        class={bodyClass}
        contentClassName={scrollContentClass.value}
        enabled={props.virtualEnabled}
        lineHeight={lineHeight.value}
        list={list}
        maxHeight={bodyMaxHeight.value}
        rowKey={props.rowKey}
        scrollEvent={true}
        scrollbar={{ enabled: props.scrollbar }}
        throttleDelay={120}
        onContentScroll={handleScrollChanged}
      >
        {{
          beforeContent: () => renderPrepend(),
          default: (scope: Record<string, object>) => childrend?.(scope?.data ?? []),
          afterSection: () => [
            <div class={resizeColumnClass}></div>,
            <div class={fixedWrapperClass.value}>{fixedRows?.()}</div>,
          ],
        }}
      </VirtualRender>
    );
  };

  const renderFooter = (childrend?) => {
    return (
      <div
        ref={refFooter}
        style={footerStyle.value}
        class={footerClass.value}
      >
        {childrend}
      </div>
    );
  };

  const setFixedColumns = (values: Column[]) => {
    fixedColumns.length = 0;
    fixedColumns.push(...values);
  };

  const renderFixedBottom = () => {
    return getFixedBottomRender();
  };

  return {
    renderContainer,
    renderHeader,
    renderBody,
    renderFooter,
    renderFixedBottom,
    getBodyHeight,
    setBodyHeight,
    setVirtualBodyHeight,
    setFootHeight,
    setTranslateX,
    setDragOffsetX,
    setFixedColumns,
    setOffsetRight,
    setLineHeight,
    setHeaderRowCount,
    initRootStyleVars,
    refRoot,
    refHead,
    refBody,
    refFooter,
  };
};
