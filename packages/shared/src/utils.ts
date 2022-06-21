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
import { throttle } from 'lodash';
const lowerStr = 'abcdefghijklmnopqrstuvwxyz0123456789';
/**
 * 生成n位长度的字符串
 * @param {Number} n
 * @param str,默认26位字母及数字
 */
export const random = (n: number, str = lowerStr) => {
  let result = '';
  for (let i = 0; i < n; i++) {
    result += str[parseInt((Math.random() * str.length).toString(), 10)];
  }
  return result;
};

/**
 * 监听目标元素的Resize事件
 * @param root 目标元素
 * @param callbackFn 执行函数
 * @param delay 延迟执行时间，默认 60
 * @param immediate 是否立即执行回调函数
 * @returns "{ start: () => void, stop: () => void }"
 */
export const observerResize = (
  root: HTMLElement,
  callbackFn: () => void,
  delay = 60,
  immediate = false,
) => {
  const callFn = throttle(() => {
    if (typeof callbackFn === 'function') {
      callbackFn();
    }
  }, delay);
  const resizeObserver = new ResizeObserver(() => {
    callFn();
  });

  if (immediate) {
    if (typeof callbackFn === 'function') {
      callbackFn();
    }
  }
  return {
    start: () => {
      resizeObserver.observe(root);
    },
    stop: () => {
      resizeObserver.disconnect();
      resizeObserver.unobserve(root);
    },
  };
};
