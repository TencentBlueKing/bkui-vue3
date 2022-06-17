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

import { bkZIndexManager } from '@bkui-vue/shared';
import { createPopper, OptionsGeneric, Placement } from '@popperjs/core';

import '../../styles/src/mixins/popper.less';
export declare type IOptions = {
  arrow: boolean,
  disabled: boolean,
  placement: Placement;
  content: string;
  showOnInit: boolean;
  theme: string;
  trigger: string;
  distance: number;
  onShow: () => void;
  onHide: () => void;
};

const tooltips: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const opts = initOptions();
    if (typeof binding.value === 'object') {
      Object.assign(opts, binding.value);
    } else {
      opts.content = binding.value;
    }
    const { disabled, arrow, theme } = opts;
    if (disabled) {
      return;
    }
    const popper = renderContent(opts.content, arrow, theme === 'light');
    createPopperInstance(el, popper, opts);
  },
};

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
    onShow: () => {},
    onHide: () => {},
  };
  return defaultOpts;
}

function renderContent(value: string, hasArrow: boolean, isLight: boolean): HTMLElement {
  const zIndex = bkZIndexManager.getPopperIndex();
  const content = document.createElement('div');
  content.className = `bk-popper ${isLight ? 'light' : 'dark'}`;
  content.innerText = value;
  content.style.zIndex = String(zIndex);
  if (hasArrow) {
    const arrow = renderArrow();
    content.appendChild(arrow);
  }
  document.body.appendChild(content);
  return content;
}

function renderArrow(): HTMLElement {
  const arrow = document.createElement('div');
  arrow.className = 'bk-popper-arrow';
  arrow.setAttribute('data-popper-arrow', '');
  return arrow;
}

function createPopperInstance(el: HTMLElement, popper: HTMLElement, options: IOptions) {
  const { placement, distance, trigger, showOnInit, onShow, onHide } = options;
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

  if (trigger === 'hover') {
    let hideTimeout = null;
    el.addEventListener('mouseenter', () => {
      show();
      clearTimeout(hideTimeout);
    });
    popper.addEventListener('mouseenter', () => {
      clearTimeout(hideTimeout);
    });
    el.addEventListener('mouseleave', () => {
      hideTimeout = setTimeout(hide, 100);
    });
    popper.addEventListener('mouseleave', () => {
      hideTimeout = setTimeout(hide, 100);
    });
  } else if (trigger === 'click') {
    document.body.addEventListener('click', (event) => {
      if (el.contains(event.target as HTMLElement) && !popper.hasAttribute('data-show')) {
        show();
      } else if (popper.hasAttribute('data-show')) {
        hide();
      }
    });
  }

  if (showOnInit) show();

  function show() {
    // Make the tooltip visible
    popper.setAttribute('data-show', '');
    onShow();

    // Enable the event listeners
    popperInstance.setOptions(options => ({
      ...options,
      modifiers: [
        ...options.modifiers,
        { name: 'eventListeners', enabled: true },
      ],
    }));

    // Update its position
    popperInstance.update();
  }

  function hide() {
    // Hide the tooltip
    popper.removeAttribute('data-show');
    onHide();

    // Disable the event listeners
    popperInstance.setOptions((options: Partial<OptionsGeneric<any>>) => ({
      ...options,
      modifiers: [
        ...options.modifiers,
        { name: 'eventListeners', enabled: false },
      ],
    }));
  }
}

export default tooltips;
