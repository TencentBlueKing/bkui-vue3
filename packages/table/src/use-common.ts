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

import { computed, onMounted, reactive, ref } from 'vue';
import { classes, resolveClassName } from '@bkui-vue/shared';
import { ITableColumn } from './components/table-column';
import {
  BORDER_OPTION,
  LINE_HEIGHT,
  SCROLLY_WIDTH,
} from './const';

import { Column, TablePropTypes } from './props';
import useColumn from './use-column';
import {
  hasRootScrollY,
  resolveHeadConfig,
  resolveNumberOrStringToPix,
  resolvePropBorderToClassStr,
  resolvePropVal,
} from './utils';
import { ITableResponse } from './use-data';

/**
 * 渲染class settings
 * @param props: TablePropTypes
 * @param targetColumns 解析之后的column配置（主要用来处理通过<bk-column>配置的数据结构）
 * @param root root element
 * @param TableSchema 组件内部定义的响应式对象
 * @param pageData 当前页数据
 */
export const useClass = (
  props: TablePropTypes,
  targetColumns: ITableColumn[],
  root?,
  TableSchema?: ITableResponse,
  pageData?: any[],
) => {
  const { getColumns } = useColumn(props, targetColumns);
  const autoHeight = ref(LINE_HEIGHT * 10);
  const fixHeight = ref(LINE_HEIGHT * 10);
  const maxFixHeight = ref(LINE_HEIGHT * 10);
  const headHeight = ref(LINE_HEIGHT);
  const hasScrollY = ref(false);
  const hasFooter = computed(() => props.pagination && props.data.length);
  const hasScrollYRef = computed(() => hasScrollY.value);
  const tableClass = computed(() =>
    classes(
      {
        [resolveClassName('table')]: true,
        'has-footer': hasFooter.value,
        'has-scroll-y': hasScrollY.value || props.virtualEnabled,
        [resolveClassName('table-flex')]: props.isFlex,
      },
      resolvePropBorderToClassStr(props.border),
    ),
  );

  const headClass = classes({
    [resolveClassName('table-head')]: true,
    'has-settings': !!props.settings,
  });

  const resolvedColumns = computed(() => getColumns() as Column[]);

  const config = resolveHeadConfig(props);
  const headStyle = computed(() => ({
    '--row-height': `${resolvePropVal(config, 'height', ['thead'])}px`,
    '--scroll-head-left': `-${TableSchema.formatData.layout.translateX}px`,
    '--scroll-left': `${TableSchema.formatData.layout.translateY}px`,
  }));

  const contentClass = {
    [resolveClassName('table-body')]: true,
  };

  const footerClass = computed(() =>
    classes({
      [resolveClassName('table-footer')]: true,
      ['is-hidden']: !props.pagination || !props.data.length,
    }),
  );
  const getTableHeight = (): string => {
    if (props.height === 'number') {
      return `${props.height}px`;
    }
    if (typeof props.height === 'string') {
      return props.height;
    }
    return '';
  };
  const resolveWidth = () => {
    if (resolvedColumns.value.every((col: Column) => /^\d+\.?\d*(px)?$/gi.test(`${col.width}`))) {
      const rectWidth = resolvedColumns.value.reduce(
        (width: number, col: Column) => width + Number(`${col.width}`.replace(/px/gi, '')),
        0,
      );
      const offset = hasScrollY.value ? SCROLLY_WIDTH : 0;
      return `${rectWidth + offset}px`;
    }

    return '100%';
  };

  /** 表格外层容器样式 */
  const wrapperStyle = computed(() => ({
    minHeight: resolveNumberOrStringToPix(props.minHeight, 'auto'),
    width: resolveWidth(),
    maxWidth: '100%',
    height: getTableHeight(),
    // maxHeight: props.maxHeight,
  }));

  const resolvePropHeight = (height: number | string, parentHeight?: number) => {
    const strHeight = String(height);
    if (/^\d+\.?\d*$/.test(strHeight)) {
      return parseFloat(strHeight);
    }

    if (/^\d+\.?\d*px$/gi.test(strHeight)) {
      return parseFloat(strHeight.replace('px', ''));
    }

    if (/^\d+\.?\d*%$/gi.test(strHeight)) {
      if (typeof parentHeight === 'number') {
        const percent = parseFloat(strHeight.replace('%', ''));
        return (parentHeight * percent) / 100;
      }

      return strHeight;
    }

    return parentHeight ?? height;
  };

  /** 表格外层容器样式 */
  const contentStyle: {
    display: string | boolean,
    minHeight: string | number,
    height: string | number,
    maxHeight: string | number,
  } = reactive({
    display: '',
    minHeight: '',
    height: '',
    maxHeight: '',
  });

  const getHeadHeight = (rootEl?) => {
    if (props.showHead) {
      if (!rootEl) {
        return resolvePropHeight(props.headHeight, LINE_HEIGHT) ?? 0;
      }

      const selector = resolveClassName('table-head');
      const head = rootEl.querySelector(selector) as HTMLElement;
      return head?.offsetHeight ?? resolvePropHeight(props.headHeight, LINE_HEIGHT) ?? 0;
    }

    return 0;
  };

  const resolveContentHeight = (resolveHeight, headHeight, resolveFooterHeight) => {
    if (/%$/.test(`${resolveHeight}`)) {
      return `calc(${resolveHeight} - ${headHeight + resolveFooterHeight}px)`;
    }

    if (typeof resolveHeight === 'number') {
      const target = resolveHeight - headHeight - resolveFooterHeight;
      return `${target > 0 ? target : 0}px`;
    }

    return resolveHeight;
  };

  const getMaxheight = (resolveHeight, maxHeightFn) => {
    if (/^\d+\.?\d*$/.test(resolveHeight)) {
      return `${resolveHeight}px`;
    }

    return maxHeightFn();
  };

  const resolveContentStyle = rootEl => {
    const resolveHeight = resolvePropHeight(props.height);
    headHeight.value = getHeadHeight(rootEl) as number;
    const resolveMinHeight = resolvePropHeight(props.minHeight, autoHeight.value) as number;
    const resolveFooterHeight = props.pagination && props.data.length ? props.paginationHeight : 0;
    const contentHeight = resolveContentHeight(resolveHeight, headHeight.value, resolveFooterHeight);

    const minHeight = resolveMinHeight - headHeight.value - resolveFooterHeight;

    const maxHeight = getMaxheight(resolveHeight, () => {
      const resolveMaxHeight = resolvePropHeight(props.maxHeight);
      return resolveContentHeight(resolveMaxHeight, headHeight.value, resolveFooterHeight);
    });

    contentStyle.display = pageData?.length ? 'block' : false;
    contentStyle.minHeight = `${minHeight}px`;
    contentStyle.height = contentHeight;
    contentStyle.maxHeight = maxHeight;
  };

  onMounted(() => {
    resetTableHeight(root?.value);
  });

  const resetTableHeight = (rootEl: HTMLElement) => {
    if (rootEl) {
      const headHeight = getHeadHeight(rootEl);
      const contentselector = `.${resolveClassName('table-body-content')} > table`;
      const bodySelector = `.${resolveClassName('table-body')}`;

      const tableBody = rootEl.querySelector(bodySelector) as HTMLElement;
      const tableBodyContent = rootEl.querySelector(contentselector) as HTMLElement;

      resolveContentStyle(rootEl);
      maxFixHeight.value = (tableBody?.offsetHeight ?? LINE_HEIGHT * 10) + (headHeight as number);
      fixHeight.value = (tableBodyContent?.offsetHeight ?? LINE_HEIGHT * 10) + (headHeight as number);
      updateBorderClass(rootEl);
    }
  };

  const updateBorderClass = (root: HTMLElement) => {
    if (!root) {
      return;
    }
    const querySelector = props.virtualEnabled
      ? `.${resolveClassName('virtual-section')}`
      : `.${resolveClassName('table-body-content')}`;
    const rootBody = root.querySelector(`.${resolveClassName('table-body')}`);

    hasScrollY.value = hasRootScrollY(rootBody, querySelector, 0);
  };

  /**
   * 获取当前table计算column宽度需要减去的边框和scroll填充
   * @returns 宽度
   */
  const getColumnsWidthOffsetWidth = () => {
    let offsetWidth = 0;
    if (hasScrollY.value) {
      offsetWidth = offsetWidth + SCROLLY_WIDTH;
    }

    if (props.border.includes(BORDER_OPTION.OUTER) && !props.border.includes(BORDER_OPTION.NONE)) {
      offsetWidth = offsetWidth + 2;
    }

    return offsetWidth;
  };

  return {
    tableClass,
    headClass,
    contentClass,
    footerClass,
    wrapperStyle,
    contentStyle,
    headStyle,
    fixHeight,
    maxFixHeight,
    resetTableHeight,
    updateBorderClass,
    getColumnsWidthOffsetWidth,
    hasFooter,
    hasScrollY,
    hasScrollYRef,
  };
};
