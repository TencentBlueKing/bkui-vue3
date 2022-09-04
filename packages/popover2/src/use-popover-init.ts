
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
import { ref } from 'vue';

import { EMITEVENTS } from './const';
import useFloating from './use-floating';
import usePopperId from './use-popper-id';

export default (props, ctx, refReference, refContent, refArrow, refRoot) => {
  let storeEvents = null;
  const isFullscreen = ref(false);
  const {
    localIsShow,
    showPopover,
    hidePopover,
    updatePopover,
    resolveTriggerEvents,
    resolvePopElements,
    isElementFullScreen,
    cleanup,
    createPopInstance,
  } = useFloating(props, ctx, refReference, refContent, refArrow, refRoot);

  const showFn = () => {
    showPopover();
  };

  const hideFn = () => {
    hidePopover();
  };

  const initPopInstance = () => {
    createPopInstance();
    if (props.always) {
      showPopover();
    } else {
      addEventToPopTargetEl();
    }
  };

  const addEventToPopTargetEl = () => {
    const { elReference, elContent } = resolvePopElements();
    storeEvents = resolveTriggerEvents();
    if (Array.isArray(storeEvents)) {
      addEventToTargetEl(elReference, storeEvents);
    } else {
      const { content, reference } = storeEvents;
      addEventToTargetEl(elReference, reference);
      addEventToTargetEl(elContent, content);
    }
  };

  const addEventToTargetEl = (target: HTMLElement, evets: any[]) => {
    evets.forEach(([event, listener]) => {
      if (event && typeof listener === 'function') {
        target.addEventListener(event, listener);
      }
    });
  };

  const removeEventListener = () => {
    if (storeEvents?.length) {
      const { elReference } = resolvePopElements();
      if (elReference) {
        storeEvents.forEach(([event, listener]) => {
          if (event && typeof listener === 'function') {
            elReference.removeEventListener(event, listener);
          }
        });
      }

      storeEvents = null;
    }
  };

  const updateBoundary = () => {
    const { elReference, root } = resolvePopElements();
    boundary.value = getPrefixId(isFullscreen.value, root || elReference);
  };

  const { getPrefixId, resetFullscreenElementTag } = usePopperId(props, '#');
  const boundary = ref();

  const beforeInstanceUnmount = () => {
    if (typeof cleanup === 'function') {
      cleanup();
    }

    removeEventListener();
  };

  const handleFullscreenChange = () => {
    isFullscreen.value = isElementFullScreen();
    resetFullscreenElementTag();
    updateBoundary();
    updatePopover(null, props);
  };

  const onMountedFn = () => {
    if (props.disabled) {
      return;
    }

    initPopInstance();
    updateBoundary();

    document.body.addEventListener('fullscreenchange', handleFullscreenChange);
  };

  const onUnmountedFn = () => {
    beforeInstanceUnmount();
    document.body.removeEventListener('fullscreenchange', handleFullscreenChange);
  };

  const handleClickOutside = (_e: MouseEvent) => {
    ctx.emit(EMITEVENTS.CLICK_OUTSIDE, { isShow: localIsShow.value, event: _e });
    if (props.disableOutsideClick || props.always || props.disabled || props.trigger === 'manual') {
      return;
    }

    if (localIsShow.value) {
      hideFn();
    }
  };

  return {
    onMountedFn,
    onUnmountedFn,
    handleClickOutside,
    beforeInstanceUnmount,
    updateBoundary,
    initPopInstance,
    updatePopover,
    showFn,
    hideFn,
    boundary,
  };
};
