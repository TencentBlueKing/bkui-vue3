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
import { computed, onMounted, ref } from 'vue';

import { classes, resolveClassName } from '@bkui-vue/shared';

import { isPercentPixOrNumber, resolveNumberOrStringToPix, resolvePropBorderToClassStr } from './utils';

export const useClass = (props, root?) => {
  const autoHeight = ref('auto');
  const tableClass = computed(() => (classes({
    [resolveClassName('table')]: true,
  }, resolvePropBorderToClassStr(props.border))));

  const headClass = classes({
    [resolveClassName('table-head')]: true,
  });

  const contentClass = classes({
    [resolveClassName('table-body')]: true,
  });

  const footerClass = classes({
    [resolveClassName('table-footer')]: true,
    ['is-hidden']: !props.pagination,
  });

  /** 表格外层容器样式 */
  const wrapperStyle = computed(() => ({
    minHeight: resolveNumberOrStringToPix(props.minHeight, 'auto'),
  }));

  /** 表格外层容器样式 */
  const contentStyle = computed(() => {
    const isAutoHeight = !isPercentPixOrNumber(props.height);
    const resolveHeight = resolveNumberOrStringToPix(props.height);
    const resolveHeadHeight = props.showHead ? resolveNumberOrStringToPix(props.headHeight) : '0';

    const resolveFooterHeight = props.pagination ? 40 : 0;
    const contentHeight = `calc(${resolveHeight} - ${resolveHeadHeight} - ${resolveFooterHeight}px - 2px)`;
    return {
      display: 'block',
      ...(isAutoHeight ? { maxHeight: contentHeight }
        : { height: contentHeight }),
    };
  });

  onMounted(() => {
    resetTableHeight(root?.value);
  });

  const resetTableHeight = (rootEl: HTMLElement) => {
    if (rootEl) {
      const { height } = (root.value as HTMLElement).parentElement.getBoundingClientRect();
      autoHeight.value = `${height}px`;
    }
  };

  return { tableClass, headClass, contentClass, footerClass, wrapperStyle, contentStyle, resetTableHeight };
};
