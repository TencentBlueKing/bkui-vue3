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

import $bkPopover from '@bkui-vue/plugin-popover';

const resolveOptions = (el: HTMLElement, binding: DirectiveBinding) => {
  const options: any = {
    content: '',
    target: el,
  };
  if (typeof binding.value === 'object') {
    Object.assign(options, binding.value);
  } else {
    options.content = binding.value;
  }

  return options;
};

export const createInstance = (el: HTMLElement, binding: any) => {
  let instance = null;
  let createTimer = null;
  let hidePopTimer = null;
  const options = resolveOptions(el, binding);
  const { disabled } = options;
  if (disabled || instance) {
    return;
  }

  const handleContentEnter = () => {
    hidePopTimer && clearTimeout(hidePopTimer);
    hidePopTimer = null;
  };

  const handleContentLeave = () => {
    if (createTimer) {
      clearTimeout(createTimer);
    }
    instance?.hide();
    instance?.close();
    instance = null;
  };

  const handleMouseEnter = () => {
    createTimer && clearTimeout(createTimer);
    createTimer = setTimeout(() => {
      const targetOptions = resolveOptions(el, binding);
      targetOptions.isShow = true;
      targetOptions.content = targetOptions.content || el.innerHTML;
      targetOptions.allowHtml = true;
      Object.assign(targetOptions, {
        onContentMouseenter: handleContentEnter,
        onContentMouseleave: handleContentLeave,
      });
      instance = $bkPopover(targetOptions);
    }, 100);
  };

  const handleMouseLeave = () => {
    hidePopTimer = setTimeout(() => {
      if (createTimer) {
        clearTimeout(createTimer);
      }
      instance?.hide();
      instance?.close();
      instance = null;
    }, 120);
  };

  el.addEventListener('mouseenter', handleMouseEnter);
  el.addEventListener('mouseleave', handleMouseLeave);

  Object.assign(binding, {
    __cached: {
      handleMouseEnter,
      handleMouseLeave,
    },
  });

  const destroyInstance = (element?: HTMLElement) => {
    handleMouseLeave();
    (element ?? el)?.removeEventListener('mouseenter', handleMouseEnter);
    (element ?? el)?.removeEventListener('mouseleave', handleMouseLeave);
  };

  return {
    destroyInstance,
    instance,
  };
};

const ellipsis: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    createInstance(el, binding);
  },
  beforeUnmount(el: HTMLElement, binding: any) {
    if (binding.__cached) {
      const { handleMouseEnter, handleMouseLeave } = binding.__cached;
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      binding.__cached = null;
    }
  },
};

export default ellipsis;
