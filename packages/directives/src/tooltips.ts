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

import { DirectiveBinding, ObjectDirective } from 'vue';

import { bkZIndexManager, resolveClassName } from '@bkui-vue/shared';
import { createPopper, Placement } from '@popperjs/core';

export declare type IOptions = {
  arrow: boolean,
  disabled: boolean,
  placement: Placement;
  content: string;
  showOnInit: boolean;
  theme: string;
  trigger: string;
  distance: number;
  extCls: string,
  delay: number,
  onShow: () => void;
  onHide: () => void;
};
const nodeList = new Map();

const tooltips: ObjectDirective = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    const opts = getOpts(binding);
    const { trigger } = opts;
    const popper = renderContent(opts);
    let delayTimeout = null;

    if (trigger === 'hover') {
      let hideTimeout = null;
      el.addEventListener('mouseenter', () => {
        delayTimeout = setTimeout(() => {
          show(el);
          clearTimeout(hideTimeout);
          clearTimeout(delayTimeout);
        }, opts.delay);
      });
      popper.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
      });
      el.addEventListener('mouseleave', () => {
        clearTimeout(delayTimeout);
        hideTimeout = setTimeout(() => {
          hide(el);
        }, 100);
      });
      el.addEventListener('click', () => {
        hide(el);
      });
      popper.addEventListener('mouseleave', () => {
        clearTimeout(delayTimeout);
        hideTimeout = setTimeout(() => {
          hide(el);
        }, 100);
      });
    } else if (trigger === 'click') {
      document.body.addEventListener('click', (event) => {
        if (el.contains(event.target as HTMLElement) && !popper.hasAttribute('data-show')) {
          delayTimeout = setTimeout(() => {
            show(el);
            clearTimeout(delayTimeout);
          }, opts.delay);
        } else if (popper.hasAttribute('data-show')) {
          hide(el);
        }
      });
    }

    nodeList.set(el, {
      opts,
      popper,
      popperInstance: null,
    });
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    nodeList.get(el).opts = getOpts(binding);
  },
  unmounted(el) {
    hide(el);
    nodeList.delete(el);
  },
};

/**
 * 初始化配置
 * @returns tooltips配置
 */
function initOptions(): IOptions {
  const defaultOpts: IOptions = {
    arrow: true,
    disabled: false,
    trigger: 'hover',
    theme: 'dark',
    content: '',
    showOnInit: false,
    placement: 'top',
    distance: 8,
    extCls: '',
    delay: 0,
    onShow: () => {},
    onHide: () => {},
  };
  return defaultOpts;
}

/**
 * 获取配置
 * @returns tooltips配置
 */
function getOpts(binding: DirectiveBinding) {
  const opts = initOptions();
  if (typeof binding.value === 'object') {
    Object.assign(opts, binding.value);
  } else {
    opts.content = binding.value;
  }
  return opts;
}

/**
 * 创建tooltips DOM
 * @param opts
 * @returns
 */
function renderContent(opts): HTMLElement {
  const { content: value, arrow: hasArrow, theme, extCls } = opts;
  const isLight = theme === 'light';
  const zIndex = bkZIndexManager.getPopperIndex();
  const content = document.createElement('div');
  content.className = `${resolveClassName('popper')} ${isLight ? 'light' : 'dark'} ${extCls}`;
  content.innerText = value;
  content.style.zIndex = String(zIndex);
  if (hasArrow) {
    const arrow = renderArrow();
    content.appendChild(arrow);
  }
  return content;
}

/**
 * 渲染箭头dom
 * @returns arrow DOM
 */
function renderArrow(): HTMLElement {
  const arrow = document.createElement('div');
  arrow.className = resolveClassName('popper-arrow');
  arrow.setAttribute('data-popper-arrow', '');
  return arrow;
}

/**
 * 创建popper实例
 * @param el
 * @param popper
 * @returns popper实例
 */
function createPopperInstance(el: HTMLElement, popper: HTMLElement) {
  const { opts } = nodeList.get(el);
  const { placement, distance, showOnInit } = opts;
  const popperInstance = createPopper(el, popper, {
    placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, distance],
        },
      },
    ],
  });

  if (showOnInit) show(el);
  return popperInstance;
}

/**
 * 显示
 * @param el
 */
function show(el: HTMLElement) {
  const { popper, opts } = nodeList.get(el);
  const { disabled, content, arrow: hasArrow, onShow } = opts;
  if (disabled) return;
  popper.innerText = content;
  if (hasArrow) {
    const arrow = renderArrow();
    popper.appendChild(arrow);
  }
  document.body.appendChild(popper);
  const popperInstance = createPopperInstance(el, popper);
  onShow();

  // Make the tooltip visible
  popper.setAttribute('data-show', '');
  // Enable the event listeners
  popperInstance.setOptions(options => ({
    ...options,
    modifiers: [
      ...options.modifiers,
      { name: 'eventListeners', enabled: true },
    ],
  }));

  // Update its position
  popperInstance.forceUpdate();
  nodeList.get(el).popperInstance = popperInstance;
}

/**
 * 隐藏
 * @param el
 */
function hide(el: HTMLElement) {
  if (!nodeList.get(el)) return;
  const { popper, popperInstance, opts } = nodeList.get(el);
  const { onHide } = opts;
  if (popper && document.body.contains(popper)) {
    popper.removeAttribute('data-show');
    popperInstance?.destroy();
    document.body.removeChild(popper);
    onHide();
  }
}
export default tooltips;
