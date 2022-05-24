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

import {
  LeftShape,
  RightShape,
} from '@bkui-vue/icon';
import BkPopover from '@bkui-vue/popover';

import type {
  IPaginationInstance,
} from './type';

export default () => {
  const {
    proxy,
  } = getCurrentInstance() as ComponentInternalInstance &  { proxy: IPaginationInstance};


  const inputRef = ref<HTMLInputElement>(null);
  const isFocused = ref<boolean>(false);
  const localCurrent = ref<number>(1);

  const isPagePreDisabled = computed<boolean>(() => localCurrent.value === 1);
  const isPageNextDisabled = computed<boolean>(() => localCurrent.value === proxy.totalPageNum);

  // 缓存input输入，失焦或者enter键触发提交
  let inputMemo = 0;

  // 页码可选列表
  const list = computed<number[]>(() => {
    const stack = [];
    for (let i = 1; i <= proxy.totalPageNum; i++) {
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
      inputMemo = localCurrent.value;
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
   * @desc 获得焦点
   */
  const handlePageEditorFocus = () => {
    isFocused.value = true;
  };
  /**
   * @desc 失去焦点
   */
  const handlePageEditorBlur = () => {
    isFocused.value = false;
    inputRef.value.textContent = `${inputMemo}`;
    if (inputMemo !== localCurrent.value) {
      localCurrent.value = inputMemo;
    }
  };
  /**
   * @desc 键盘输入
   * @param { Event } event
   */
  const handlePageEditorInput = (event: Event) => {
    const $target = event.target as HTMLElement;
    const value = Number($target.textContent);
    // 无效值不抛出事件
    if (!value || value < 1 || value > proxy.totalPageNum || (value === localCurrent.value)) {
      return;
    };
    inputMemo = value;
  };
  /**
   * @desc 处理Enter事件
   * @param { KeyboardEvent } event
   */
  const handlePageEditorKeydown = (event: KeyboardEvent) => {
    // 阻止默认enter事件（keycode判断可能会被弃用）
    if (['Enter', 'NumpadEnter'].includes(event.code)) {
      event.preventDefault();
      handlePageEditorBlur();
    }
  };
  /**
   * @desc 更新
   */
  const handlePageChange = (item: number) => {
    inputMemo = item;
    handlePageEditorBlur();
  };

  const render = () => (
    <div class="bk-pagination-small-list">
      <div
        class={{
          'bk-pagination-btn-pre': true,
          'is-disabled': isPagePreDisabled.value,
        }}
        onClick={handlePrePage}>
          <LeftShape />
      </div>
      <BkPopover
        theme="light"
        trigger="click"
        arrow={false}
        boundary="body"
        placement="bottom">
        {{
          default: () => (
            <div class={{
              'bk-pagination-picker': true,
              'is-focused': isFocused.value,
            }}>
              <span
                ref={inputRef}
                class="bk-pagination-editor"
                contenteditable
                spellcheck="false"
                onFocus={handlePageEditorFocus}
                onBlur={handlePageEditorBlur}
                onInput={handlePageEditorInput}
                onKeydown={handlePageEditorKeydown}>
                {localCurrent.value}
              </span>
              <span>/</span>
              <span class="bk-pagination-small-list-total">{proxy.totalPageNum}</span>
            </div>
          ),
          content: () => (
            <div class="bk-pagination-picker-list">
              {list.value.map(item => (
                <div
                  class={{
                    item: true,
                    'is-actived': item === localCurrent.value,
                  }}
                  key={item}
                  onClick={() => handlePageChange(item)}>
                  {item}
                </div>
              ))}
            </div>
          ),
        }}
      </BkPopover>
      <div
        class={{
          'bk-pagination-btn-next': true,
          'is-disabled': isPageNextDisabled.value,
        }}
        onClick={handleNextPage}>
          <RightShape />
      </div>
    </div>
  );
  return {
    current: localCurrent,
    render,
  };
};
