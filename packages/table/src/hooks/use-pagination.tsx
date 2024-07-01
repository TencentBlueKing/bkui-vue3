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

import { computed, reactive, ref, toRaw, watch } from 'vue';

import { TablePropTypes } from '../props';
const usePagination = (props: TablePropTypes) => {
  // 当前分页缓存，用于支持内置前端分页，用户无需接收change事件来自行处理数据分割
  const pagination = reactive({
    enabled: false,
    count: 0,
    limit: 10,
    current: 1,
    align: 'right',
    layout: ['total', 'limit', 'list'],
  });

  /**
   * 如果手动禁用分页，则禁用前端分页，否则启用前端分页
   */
  const isEnabled = ref(true);
  const totalPage = computed(() => Math.ceil(pagination.count / pagination.limit));

  const setPagination = (option: Record<string, any>) => {
    Object.assign(pagination, { enabled: !!props.pagination }, option);

    /**
     * 如果分页组件启用了前端分页，则重置分页组件数据
     */
    if (pagination.current > totalPage.value) {
      pagination.current = 1;
    }
  };

  const disabledPagination = (disable = true) => {
    isEnabled.value = !disable;
  };

  watch(
    () => [props.pagination],
    () => {
      if (typeof props.pagination === 'object') {
        setPagination(toRaw(props.pagination));
      }

      /**
       * 分页组件是否启用
       * 判定条件：没有手动禁用 & 设置了相关分页配置
       */
      pagination.enabled = isEnabled.value && !!props.pagination;
    },
    { immediate: true, deep: true },
  );

  watch(
    () => [props.data],
    () => {
      if (!props.remotePagination) {
        setPagination({
          count: props.data.length,
        });
      }
    },
    { immediate: true },
  );

  /**
   * 是否显示分页组件
   * 判定条件：启用了分页组件 & 分页总数 > 1
   */
  const isShowPagination = computed(() => {
    return pagination.enabled;
  });

  return {
    options: pagination,
    isShowPagination,
    setPagination,
    disabledPagination,
  };
};
export type UsePagination = ReturnType<typeof usePagination>;
export default usePagination;
