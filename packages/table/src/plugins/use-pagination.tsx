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
import { computed, nextTick, reactive, ref, watch } from 'vue';

import { COLUMN_ATTRIBUTE } from '../const';
import { Column, SortScope, TablePropTypes } from '../props';
import { getRawData } from '../utils';

/**
 * 处理 Prop中的分页配置
 * prop中的配置会覆盖本地的配置
 * @param propPagination 用户传入的配置
 * @param defVal 默认配置
 * @returns 返回值
 */
export const resolvePaginationOption = (propPagination: any, defVal: any) => {
  if (!!propPagination) {
    if (typeof propPagination === 'object') {
      let current = Object.prototype.hasOwnProperty.call(propPagination, 'current')
        ? propPagination.current
        : propPagination.value;
      if (!/\d+/.test(current)) {
        current = 1;
      }

      return { ...defVal, ...propPagination, current };
    }

    return defVal;
  }

  return {};
};

export default (props: TablePropTypes) => {
  const startIndex = ref(0);
  const endIndex = ref(0);
  /**
   * 分页配置
   * 用于配置分页组件
   * pagination 为Prop传入配置
   * 方便兼容内置分页功能，此处需要单独处理count
   */
  const propsData = computed(() => props.data);
  const localPagination = ref(null);
  const indexData = reactive([]);

  // 当前分页缓存，用于支持内置前端分页，用户无需接收change事件来自行处理数据分割
  let pagination = reactive({
    count: 0,
    limit: 10,
    current: 1,
    align: 'right',
    layout: ['total', 'limit', 'list'],
  });

  const resolveLocalPagination = () => {
    if (!props.pagination) {
      return;
    }
    localPagination.value = props.remotePagination ? pagination : { ...pagination, count: indexData.length };
  };

  /**
   * 重置当前分页开始位置 & 结束位置
   * 如果未启用分页，则开始位置为0，结束位置为 data.length
   * @returns
   */
  const resetStartEndIndex = () => {
    if (!props.pagination || props.remotePagination) {
      startIndex.value = 0;
      endIndex.value = indexData.length;
      return;
    }

    // 如果是前端分页
    startIndex.value = (pagination.current - 1) * pagination.limit;
    endIndex.value = pagination.current * pagination.limit;
  };

  /**
   * 当前页分页数据
   */
  const pageData = reactive([]);

  const sort = (sourceData: any[], sortFn: any, column: Column, type: string, sortScope: SortScope) => {
    if (typeof sortFn === 'function') {
      sourceData.sort((a, b) => sortFn(a, b, type, column, sortScope));
    }
  };

  /**
   * 初始化排序动作
   * @param data
   * @param sortColumns
   */
  const multiSort = (data: any[], sortColumns: { column: Column; schema: any }[]) => {
    sortColumns.forEach(item => {
      sort(
        data,
        item.schema[COLUMN_ATTRIBUTE.COL_SORT_FN],
        item.column,
        item.schema[COLUMN_ATTRIBUTE.COL_SORT_TYPE],
        item.schema[COLUMN_ATTRIBUTE.COL_SORT_SCOPE],
      );
    });
  };

  const filter = (sourceData: any[], filterFn: (row, index, data) => void) => {
    if (typeof filterFn === 'function') {
      const filterVals = sourceData.filter((row: any, index: number) => filterFn(row, index, indexData));
      sourceData.length = 0;
      sourceData.push(...filterVals);
    }

    return sourceData;
  };

  const resolveIndexData = () => {
    return new Promise<void>(resolve => {
      nextTick(() => {
        const target = propsData.value.slice();
        indexData.length = 0;
        indexData.push(...getRawData(target));
        resolve();
      });
    });
  };

  const resolvePageData = (filterFn?: any, sortFn?: any, column?: Column, type?: string, sortScope?, multiCol?) => {
    const sourceData = indexData.slice();

    if (multiCol?.length) {
      multiSort(sourceData, multiCol);
    }

    pageData.length = 0;
    pageData.push(...sourceData.slice(startIndex.value, endIndex.value));
    filter(pageData, filterFn);
    sort(pageData, sortFn, column, type, sortScope);
    resolveLocalPagination();
  };

  const resolvePageDataBySortList = (multiCol?) => {
    resolvePageData(null, null, null, null, null, multiCol);
  };

  const multiFilter = (filterFnList: ((row, index, data) => void)[]) => {
    const sourceData = indexData.slice();
    const target = filterFnList.reduce((result, fn) => filter(result, fn), sourceData);
    pageData.length = 0;
    pageData.push(...getRawData(target));
  };

  const handlePaginationChange = () => {
    pagination = resolvePaginationOption(props.pagination, pagination);
    resolveLocalPagination();
    resetStartEndIndex();
    resolvePageData();
  };

  handlePaginationChange();

  watch(
    () => [props.pagination],
    () => {
      handlePaginationChange();
    },
    {
      deep: true,
    },
  );

  return {
    pageData,
    indexData,
    localPagination,
    resolvePageData,
    resolveIndexData,
    resolvePageDataBySortList,
    resetStartEndIndex,
    multiFilter,
    sort,
  };
};
