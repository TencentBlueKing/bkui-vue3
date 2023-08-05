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

import type {
  ComponentInternalInstance,
} from 'vue';
import {
  computed,
  getCurrentInstance,
  nextTick,
  ref,
  watch,
} from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import {
  AngleLeft,
  AngleRight,
  Ellipsis,
} from '@bkui-vue/icon';

import type {
  IPaginationInstance,
} from './type';

const PAGE_ITEMS_NUM = 5;

export default () => {
  const {
    proxy,
  } = getCurrentInstance() as ComponentInternalInstance &  { proxy: IPaginationInstance};


  const localCurrent = ref<number>(1);
  const isPagePreDisabled = computed<boolean>(() => localCurrent.value === 1);
  const isPageNextDisabled = computed<boolean>(() => localCurrent.value === proxy.totalPageNum);
  const showPreBatch = ref<boolean>(false);
  const showNextBatch = ref<boolean>(false);


  const list = computed<number[]>(() => {
    showPreBatch.value = false;
    showNextBatch.value = false;
    const stack = [];
    if (proxy.totalPageNum <= PAGE_ITEMS_NUM + 2) {
      for (let i = 2; i <= proxy.totalPageNum - 1; i++) {
        stack.push(i);
      }
      return stack;
    }
    const pageItemsNumHalf = Math.floor(PAGE_ITEMS_NUM / 2);
    if (proxy.totalPageNum > PAGE_ITEMS_NUM) {
      showPreBatch.value = localCurrent.value - pageItemsNumHalf > 2;
      showNextBatch.value = localCurrent.value + pageItemsNumHalf < proxy.totalPageNum - 1;
    }

    const start = Math.min(proxy.totalPageNum - PAGE_ITEMS_NUM, Math.max(2, localCurrent.value - pageItemsNumHalf));
    for (let i = start; i < start + PAGE_ITEMS_NUM ; i++) {
      stack.push(i);
    }
    return stack;
  });

  watch(() => proxy.modelValue, (modelValue) => {
    // nextTick延后执行，保证proxy.totalPageNum计算正确
    nextTick(() => {
      if (modelValue >= 1 && modelValue <= proxy.totalPageNum) {
        localCurrent.value = modelValue;
      } else if (modelValue < 1) {
        localCurrent.value = 1;
      } else {
        localCurrent.value = proxy.totalPageNum;
      }
    });
  }, {
    immediate: true,
  });
  // 切换limit时会导致totalPageNum变小旧的current可能会超出范围，修正localCurrent
  nextTick(() => {
    watch(() => proxy.totalPageNum, (totalPageNum) => {
      if (localCurrent.value > totalPageNum) {
        localCurrent.value = totalPageNum;
      }
    });
  });

  /**
   * @desc 上一页
   */
  const handlePrePage = () => {
    if (isPagePreDisabled.value) {
      return;
    }
    localCurrent.value = localCurrent.value - 1;
  };
  /**
   * @desc 下一页
   */
  const handleNextPage = () => {
    if (isPageNextDisabled.value) {
      return;
    }
    localCurrent.value = localCurrent.value + 1;
  };
  /**
   * @desc 跳转指定页码
   * @param { Number } totalPageNum
   */
  const handleItemClick = (totalPageNum: number) => {
    if (totalPageNum === localCurrent.value) {
      return;
    }
    localCurrent.value = totalPageNum;
  };
  /**
   * @desc 上一批分页
   */
  const handlePreBatch = () => {
    localCurrent.value = Math.max(1, localCurrent.value - PAGE_ITEMS_NUM);
  };
  /**
   * @desc 下一批分页
   */
  const handleNextBatch = () => {
    localCurrent.value = Math.min(proxy.totalPageNum, localCurrent.value + PAGE_ITEMS_NUM);
  };

  const { resolveClassName } = usePrefix();

  const render = ({ isFirst, isLast }) => (
    <div class={{
      [`${resolveClassName('pagination-list')}`]: true,
      'is-first': isFirst,
      'is-last': isLast,
    }}>
      <div
        class={{
          [`${resolveClassName('pagination-list-pre')}`]: true,
          'is-disabled': isPagePreDisabled.value,
        }}
        onClick={handlePrePage}>
        {proxy.prevText || <AngleLeft />}
      </div>
      <div
        class={{
          [`${resolveClassName('pagination-list-item')}`]: true,
          'is-active': localCurrent.value === 1,
        }}
        key="1"
        onClick={() => handleItemClick(1)}>
        1
      </div>
      {
        showPreBatch.value
        && <div
            key="pre-batch"
            class={`${resolveClassName('pagination-list-pre-batch')}`}
            onClick={handlePreBatch}>
            <Ellipsis />
          </div>
      }
      {list.value.map(num => (
        <div
          class={{
            [`${resolveClassName('pagination-list-item')}`]: true,
            'is-active': localCurrent.value === num,
          }}
          key={num}
          onClick={() => handleItemClick(num)}>
          {num}
        </div>
      ))}
      {
        showNextBatch.value
        && <div
            key="next-batch"
            class={`${resolveClassName('pagination-list-next-batch')}`}
            onClick={handleNextBatch}>
            <Ellipsis />
          </div>
      }
      {
        proxy.totalPageNum > 1
        && <div
            class={{
              [`${resolveClassName('pagination-list-item')}`]: true,
              'is-active': localCurrent.value === proxy.totalPageNum,
            }}
            key="last"
            onClick={() => handleItemClick(proxy.totalPageNum)}>
            {proxy.totalPageNum}
        </div>
      }
      <div
        class={{
          [`${resolveClassName('pagination-list-pre')}`]: true,
          'is-disabled': isPageNextDisabled.value,
        }}
        onClick={handleNextPage}>
        {proxy.nextText || <AngleRight />}
      </div>
    </div>
  );

  return {
    current: localCurrent,
    render,
  };
};
