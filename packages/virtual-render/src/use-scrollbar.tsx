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

import { Ref } from 'vue';

/**
 * 原生滚动管理 Hook
 * 提供统一的滚动控制 API
 */
export default () => {
  let targetElement: HTMLElement = null;

  /**
   * 初始化滚动目标元素
   */
  const init = (target: Ref<HTMLElement>) => {
    targetElement = target.value;
  };

  /**
   * 滚动到指定位置
   */
  const scrollTo = (x: number, y: number) => {
    if (targetElement) {
      if (typeof (targetElement as any).scrollTo === 'function') {
        targetElement.scrollTo({
          left: x,
          top: y,
          behavior: 'auto',
        });
      } else {
        // jsdom 等环境可能没有 scrollTo，降级为直接赋值
        targetElement.scrollLeft = x;
        targetElement.scrollTop = y;
      }
    }
  };

  /**
   * 更新方法（兼容旧 API，原生滚动无需更新）
   */
  const update = () => {
    // 原生滚动无需手动更新
  };

  /**
   * 更新滚动高度（兼容旧 API，原生滚动由 CSS 控制）
   */
  const updateScrollHeight = (_height: number) => {
    // 原生滚动高度由内容决定，无需手动设置
  };

  return {
    init,
    scrollTo,
    update,
    updateScrollHeight,
  };
};
