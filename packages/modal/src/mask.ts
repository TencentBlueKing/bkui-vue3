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
const maskEleLink = new WeakMap<HTMLElement, HTMLElement>();

let lastestMaskEle: HTMLElement;

let maskInstanceCount = 0;

const showMask = (maskEle: HTMLElement) => {
  if (maskEle === lastestMaskEle) {
    lastestMaskEle = maskEle;
    return;
  }
  maskInstanceCount += 1;
  if (lastestMaskEle) {
    lastestMaskEle.style.opacity = '0';
    maskEle.style.transitionProperty = '';
    // 缓存遮罩出现的顺序
    maskEleLink.set(maskEle, lastestMaskEle);
  }

  lastestMaskEle = maskEle;
};

const hideMask = (maskEle: HTMLElement) => {
  if (maskEleLink.has(maskEle)) {
    lastestMaskEle = maskEleLink.get(maskEle);
    lastestMaskEle.style.opacity = '1';
    maskEle.style.visibility = 'hidden';
    maskEleLink.delete(maskEle);
    maskInstanceCount -= 1;
    setTimeout(() => {
      maskEle.style.visibility = '';
    }, 300);
  }
};

const destroyMask = (maskEle: HTMLElement) => {
  if (maskEleLink.has(maskEle)) {
    maskEleLink.delete(maskEle);
  }
};

const getMaskCount = () => maskInstanceCount;

export const mask = { showMask, hideMask, destroyMask, getMaskCount };
