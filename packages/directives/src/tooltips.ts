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

import { DirectiveBinding, ObjectDirective, ref } from 'vue';

import { bkZIndexManager } from '@bkui-vue/shared';
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
  onShow: () => void;
  onHide: () => void;
};
const nodeList = new Map();

const tooltips: ObjectDirective = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    const opts = getOpts(binding);
    const { trigger } = opts.value;
    const popper = renderContent(opts);

    if (trigger === 'hover') {
      let hideTimeout = null;
      el.addEventListener('mouseenter', () => {
        show(el);
        clearTimeout(hideTimeout);
      });
      popper.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
      });
      el.addEventListener('mouseleave', () => {
        hideTimeout = setTimeout(() => {
          hide(el);
        }, 100);
      });
      el.addEventListener('click', () => {
        hide(el);
      });
      popper.addEventListener('mouseleave', () => {
        hideTimeout = setTimeout(() => {
          hide(el);
        }, 100);
      });
    } else if (trigger === 'click') {
      document.body.addEventListener('click', (event) => {
        if (el.contains(event.target as HTMLElement) && !popper.hasAttribute('data-show')) {
          show(el);
        } else if (popper.hasAttribute('data-show')) {
          hide(el);
        }
      });
    }

    nodeList.set(el, {
      binding,
      popper,
      popperInstance: null,
    });
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
  const opts = ref(initOptions());
  if (typeof binding.value === 'object') {
    Object.assign(opts.value, binding.value);
  } else {
    opts.value.content = binding.value;
  }
  return opts;
}

/**
 * 创建tooltips DOM
 * @param opts
 * @returns
 */
function renderContent(opts): HTMLElement {
  const { content: value, arrow: hasArrow, theme, extCls } = opts.value;
  const isLight = theme === 'light';
  const zIndex = bkZIndexManager.getPopperIndex();
  const content = document.createElement('div');
  content.className = `bk-popper ${isLight ? 'light' : 'dark'} ${extCls}`;
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
  arrow.className = 'bk-popper-arrow';
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
  const { binding } = nodeList.get(el);
  const { placement, distance, showOnInit } = getOpts(binding).value;
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
  const { popper, binding } = nodeList.get(el);
  const { disabled, content, arrow: hasArrow, onShow } = getOpts(binding).value;
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
  const { popper, popperInstance, binding } = nodeList.get(el);
  const { onHide } = getOpts(binding).value;
  if (popper && document.body.contains(popper)) {
    popper.removeAttribute('data-show');
    popperInstance?.destroy();
    document.body.removeChild(popper);
    onHide();
  }
}
export default tooltips;
