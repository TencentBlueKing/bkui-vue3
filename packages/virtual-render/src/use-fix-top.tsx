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
import { Ref } from 'vue';

import { VirtualRenderProps } from './props';
type IFixToTopParams = { index?: number; id?: string; item?: { [key: string]: any }; position: number[] };

export default (props: VirtualRenderProps, refRoot: Ref<HTMLElement>) => {
  const scrollTo = (option = { left: 0, top: 0 }) => {
    const { left, top } = option;
    refRoot.value.scrollTo(left, top);
  };

  /**
   * 指定元素滚动到顶部
   * @param param0
   */
  const fixToTop = (params: IFixToTopParams) => {
    const { id, index, item } = params;
    let targetIndex: any = typeof index === 'number' ? index - 1 : 0;

    if (id !== undefined) {
      targetIndex = props.list.findIndex(row => row[props.rowKey] === id) ?? targetIndex;
    }

    if (item !== undefined) {
      targetIndex = props.list.findIndex(row => item[props.rowKey] === row[props.rowKey]) ?? targetIndex;
    }

    if (typeof targetIndex === 'number') {
      const resolvedIndex = targetIndex >= 0 ? targetIndex : 0;
      const offsetY = resolvedIndex * props.lineHeight;
      scrollTo({ left: 0, top: offsetY });
    }
  };

  return {
    fixToTop,
    scrollTo,
  };
};
