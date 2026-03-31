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
import { nextTick, ref } from 'vue';

import { EMIT_EVENTS } from './const';
import useFloating from './use-floating';
import usePopperId from './use-popper-id';
import { getFullscreenUid, ReferenceClickSharedState, random } from './utils';

export default (props, ctx, { refReference, refContent, refArrow, refRoot }) => {
  let storeEvents = null;
  const uniqKey = random();
  const isFullscreen = ref(false);
  const fullscreenReferId = getFullscreenUid();
  const fullScreenTarget = ref();
  const {
    localIsShow,
    showPopover,
    hidePopover,
    updatePopover,
    cleanup,
    resolveTriggerEvents,
    resolvePopElements,
    isElementFullScreen,
    updateFullscreenTarget,
    createPopInstance,
    getFullscreenRoot,
    stopHide,
  } = useFloating(props, ctx, { refReference, refContent, refArrow, refRoot });

  const resetPopover = () => {
    cleanup?.();
    createPopInstance();
  };

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

  const addEventToPopTargetEl = (retryCount = 0) => {
    const { elReference, elContent } = resolvePopElements();

    // 检查元素是否存在，如果不存在则延迟执行
    // 这通常发生在 renderDirective = 'show' 时，Content 通过 Teleport 渲染，可能还未完全挂载
    if (!elReference) {
      if (retryCount >= 10) {
        console.warn('[Popover] Failed to add events: reference element not found after retries');
        return;
      }

      // 使用 nextTick 等待 DOM 更新完成
      nextTick(() => {
        addEventToPopTargetEl(retryCount + 1);
      });
      return;
    }

    storeEvents = resolveTriggerEvents();
    storeEvents.forEach(storeEvent => {
      if (Array.isArray(storeEvent)) {
        addEventToTargetEl(elReference, storeEvent);
      } else {
        const { content, reference } = storeEvent;
        addEventToTargetEl(elReference, reference);
        // elContent 可能为 null（当 renderDirective = 'show' 且 Content 还未挂载时）
        if (elContent) {
          addEventToTargetEl(elContent, content);
        }
      }
    });
  };

  const addEventToTargetEl = (target: HTMLElement | null, evets: any[]) => {
    // 检查 target 是否存在，避免在 null 上调用 addEventListener
    if (!target) {
      return;
    }

    evets.forEach(([event, listener]) => {
      if (event && typeof listener === 'function') {
        target.addEventListener(event, listener);
      }
    });
  };

  const removeEventListener = () => {
    if (storeEvents?.length) {
      const { elReference, elContent } = resolvePopElements();
      if (elReference) {
        storeEvents.forEach(storeEvent => {
          if (Array.isArray(storeEvent)) {
            storeEvent.forEach(([event, listener]) => {
              if (event && typeof listener === 'function') {
                elReference.removeEventListener(event, listener);
              }
            });
          } else {
            const { content, reference } = storeEvent;
            content.forEach(([event, listener]) => {
              if (event && typeof listener === 'function') {
                if (elContent) {
                  elContent.removeEventListener(event, listener);
                }
              }
            });
            reference.forEach(([event, listener]) => {
              if (event && typeof listener === 'function') {
                elReference.removeEventListener(event, listener);
              }
            });
          }
        });
      }

      storeEvents = null;
    }
  };

  const getClosestFullscreenElement = (elment: HTMLElement) => {
    return elment?.closest('[data-fllsrn-id]') ?? elment;
  };

  const updateBoundary = () => {
    const { elReference, root } = resolvePopElements();
    if (isFullscreen.value) {
      const { parentNode } = elReference || root || {};
      const fullscreenBoundary = fullScreenTarget?.value ?? getClosestFullscreenElement(parentNode);
      // 确保 boundary 始终有一个有效值，避免 Teleport 的 to 属性为 undefined
      boundary.value = fullscreenBoundary || 'body';
      return;
    }

    const resolvedBoundary = getPrefixId(root || elReference);
    // 确保 boundary 始终有一个有效值，避免 Teleport 的 to 属性为 undefined
    boundary.value = resolvedBoundary || 'body';
  };

  const { getPrefixId, clearParentNodeId } = usePopperId(props, '#');

  const setFullscreenTag = () => {
    fullScreenTarget?.value?.setAttribute('data-fllsrn-id', fullscreenReferId);
  };

  const clearFullscreenTag = () => {
    const query = `[data-fllsrn-id=${fullscreenReferId}]`;
    (fullScreenTarget?.value?.querySelectorAll(query) ?? []).forEach(
      (element: { removeAttribute: (arg0: string) => void }) => {
        element?.removeAttribute('data-fllsrn-id');
      },
    );
  };

  // 初始化 boundary 为 'body'，避免 Teleport 的 to 属性为 undefined
  const boundary = ref('body');

  const beforeInstanceUnmount = () => {
    removeEventListener();
  };

  const updateFullscreen = target => {
    fullScreenTarget.value = target;
    updateFullscreenTarget(target as HTMLElement);
    isFullscreen.value = isElementFullScreen();
    setFullscreenTag();
  };

  const handleFullscreenChange = (e: Event) => {
    if (!document.fullscreenElement) {
      clearFullscreenTag();
    }

    updateFullscreen(e.target);
    updateBoundary();
    updatePopover(null, props);
  };

  // 监听父元素（Modal/Dialog）的可见性变化
  let parentVisibilityObserver: MutationObserver | null = null;

  const onMountedFn = () => {
    if (props.disabled) {
      return;
    }

    if (isElementFullScreen()) {
      const query = `[data-fllsrn-id=${fullscreenReferId}]`;
      const target = getFullscreenRoot(query);
      updateFullscreen(target);
    }

    // 先更新 boundary，确保在初始化 popover 实例之前 boundary 已正确设置
    updateBoundary();

    initPopInstance();

    document.body.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('click', handleClickOutside);

    // 监听父元素的可见性变化
    const { elReference, root } = resolvePopElements();
    const element = elReference || root;
    if (element) {
      const targetNode = element.closest('.bk-modal, .bk-dialog');
      if (targetNode) {
        parentVisibilityObserver = new MutationObserver(() => {
          if (checkParentVisibility() && localIsShow.value) {
            hideFn();
          }
        });

        parentVisibilityObserver.observe(targetNode, {
          attributes: true,
          attributeFilter: ['style', 'class'],
          subtree: true,
        });
      }
    }
  };

  const onUnmountedFn = () => {
    beforeInstanceUnmount();
    // 清理父节点上的 data-pnode-id 属性
    const { root } = resolvePopElements();
    clearParentNodeId(root);
    document.body.removeEventListener('fullscreenchange', handleFullscreenChange);
    document.removeEventListener('click', handleClickOutside);

    // 清理父元素可见性监听器
    if (parentVisibilityObserver) {
      parentVisibilityObserver.disconnect();
      parentVisibilityObserver = null;
    }
  };

  const isClickInside = (target: HTMLElement) => {
    return refContent.value?.$el?.contains?.(target) ?? false;
  };

  /**
   * 检查父元素（Modal/Dialog）是否被隐藏
   * 如果父元素被隐藏，应该关闭 Popover
   */
  const checkParentVisibility = () => {
    if (!localIsShow.value) return false;

    const { elReference, root } = resolvePopElements();
    const element = elReference || root;
    if (!element) return false;

    // 查找最近的 Modal 或 Dialog 父元素
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
      if (parent.classList.contains('bk-modal') || parent.classList.contains('bk-dialog')) {
        // 检查 Modal wrapper 是否被隐藏（Dialog 关闭时 wrapper 会被 v-show 隐藏）
        const wrapper = parent.querySelector('.bk-modal-wrapper');
        if (wrapper) {
          const wrapperStyle = window.getComputedStyle(wrapper);
          if (wrapperStyle.display === 'none' || wrapperStyle.visibility === 'hidden') {
            return true; // 父元素被隐藏
          }
        }

        // 检查父元素本身是否被隐藏
        const style = window.getComputedStyle(parent);
        if (style.display === 'none' || style.visibility === 'hidden') {
          return true; // 父元素被隐藏
        }
      }
      parent = parent.parentElement;
    }

    return false;
  };

  /**
   * 处理点击外部区域的事件
   * @param e - 事件对象
   * @param hideIgnoreReference - 是否忽略隐藏参考元素
   * @returns
   */
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (isClickInside(target)) {
      // 不要阻止默认行为，否则 checkbox 等表单元素无法正常工作
      // e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    }

    // 检查父元素（Modal/Dialog）是否被隐藏，如果隐藏则关闭 Popover
    if (checkParentVisibility()) {
      if (localIsShow.value) {
        hideFn();
      }
      return;
    }

    const commonFunc = () => {
      ctx.emit(EMIT_EVENTS.CLICK_OUTSIDE, { isShow: localIsShow.value, event: e });
      const needExec = props.disableOutsideClick || props.always || props.disabled || props.trigger === 'manual';
      if (!props.forceClickoutside && needExec) {
        return;
      }

      if (localIsShow.value) {
        hideFn();
      }
    };

    /**
     * 如果需要忽略隐藏参考元素，则设置一个定时器，在定时器结束后检查是否需要隐藏 popover
     * @param hideIgnoreReference - 是否忽略隐藏参考元素
     * @returns
     */
    if (props.hideIgnoreReference) {
      setTimeout(() => {
        if (ReferenceClickSharedState[uniqKey]) {
          ReferenceClickSharedState[uniqKey] = false;
          return;
        }

        return commonFunc();
      });
    } else {
      return commonFunc();
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
    resetPopover,
    showPopover,
    hidePopover,
    showFn,
    hideFn,
    stopHide,
    isFullscreen,
    boundary,
    localIsShow,
    uniqKey,
  };
};
