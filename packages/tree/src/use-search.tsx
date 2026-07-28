/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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

import { computed, toRef } from 'vue';

import { SearchOption, TreePropTypes } from './props';

export default (props: TreePropTypes) => {
  const refSearch = toRef(props, 'search');

  const isCommonType = (val: unknown) => ['string', 'number', 'boolean'].includes(typeof val);
  const exactMatch = (matchValue: unknown, itemValue: unknown) => matchValue === itemValue;
  const fuzzyMatchWithRegex = (regex: RegExp, itemValue: unknown) => regex.test(`${itemValue}`);
  const fuzzyMatchIncludes = (matchValue: string, itemValue: unknown) =>
    `${itemValue}`.toLowerCase().includes(matchValue);

  const isSearchDisabled = computed(() => refSearch.value === undefined || refSearch.value === false);

  const searchOption = computed<SearchOption>(() => {
    if (refSearch.value && typeof refSearch.value === 'object') {
      return refSearch.value as SearchOption;
    }
    return { value: '' };
  });

  const resultType = computed(() => searchOption.value.resultType ?? 'tree');
  const showChildNodes = computed(() => searchOption.value.showChildNodes ?? false);

  /** 只暴露原始检索值，供外部浅层 watch，避免 deep watch 整个 search 对象 */
  const searchValue = computed(() => {
    if (isSearchDisabled.value) {
      return '';
    }
    if (isCommonType(refSearch.value)) {
      return refSearch.value;
    }
    return searchOption.value.value ?? '';
  });

  const isSearchActive = computed(() => !isSearchDisabled.value && `${searchValue.value}`.length > 0);

  const isTreeUI = computed(() => resultType.value === 'tree');

  /**
   * 为一次检索创建匹配器（模糊匹配只编译一次正则），避免百万节点循环内重复 new RegExp。
   */
  const createMatcher = (): ((itemValue: unknown, item: unknown) => boolean) => {
    if (isSearchDisabled.value) {
      return () => true;
    }

    const value = searchValue.value;
    if (`${value}`.length === 0) {
      return () => false;
    }

    if (isCommonType(refSearch.value)) {
      const text = `${value}`;
      try {
        const regex = new RegExp(text, 'i');
        return itemValue => fuzzyMatchWithRegex(regex, itemValue);
      } catch {
        const lower = text.toLowerCase();
        return itemValue => fuzzyMatchIncludes(lower, itemValue);
      }
    }

    const { match = 'fuzzy' } = searchOption.value;
    if (typeof match === 'function') {
      return (itemValue, item) => !!match(value, itemValue, item);
    }

    if (match === 'full') {
      return itemValue => exactMatch(value, itemValue);
    }

    const text = `${value}`;
    try {
      const regex = new RegExp(text, 'i');
      return itemValue => fuzzyMatchWithRegex(regex, itemValue);
    } catch {
      const lower = text.toLowerCase();
      return itemValue => fuzzyMatchIncludes(lower, itemValue);
    }
  };

  const searchFn = (itemValue: unknown, item: unknown) => createMatcher()(itemValue, item);

  return {
    searchFn,
    createMatcher,
    searchValue,
    refSearch,
    isSearchActive,
    isSearchDisabled,
    resultType,
    isTreeUI,
    showChildNodes,
  };
};
