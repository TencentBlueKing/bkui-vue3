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
import { computed, ref, watch } from 'vue';

import { bkZIndexManager } from '@bkui-vue/shared';
import {
  arrow,
  autoPlacement,
  autoUpdate,
  computePosition,
  flip,
  hide,
  inline,
  offset,
  Placement,
  shift } from '@floating-ui/dom';

import { EMIT_EVENTS } from './const';
import { PopoverPropTypes } from './props';
import usePlatform from './use-platform';

/**
 * 解析popover相关配置
 */
export default (props: PopoverPropTypes, ctx, { refReference, refContent, refArrow, refRoot }) => {
  const localIsShow = ref(false);
  const fullScreenTarget = ref();
  const isElementFullScreen = () => {
    const elReference = resolveTargetElement(refReference.value?.$el);
    if (document.fullscreenElement?.shadowRoot) {
      return document.fullscreenElement.shadowRoot.contains(elReference);
    }
    return document.fullscreenElement?.contains(elReference);
  };

  /**
   * 当全屏模式开启，获取指定选择器下面的全屏元素
   * 如果是启用了webcomponent组件，则返回shadowRoot内指定的目标元素
   * @param selector
   * @returns
   */
  const getFullscreenRoot = (selector) => {
    if (isElementFullScreen()) {
      if (document.fullscreenElement.shadowRoot) {
        return document.fullscreenElement.shadowRoot.querySelector(selector);
      }

      return document.fullscreenElement.querySelector(selector);
    }

    return document.body;
  };

  const themeList = ['dark', 'light'];
  /**
   * 根据props.theme计算theme
   * 返回systemTheme & customTheme
   * systemTheme是指包含在 ['dark', 'light'] 内置主题
   * customTheme是指自定义的theme，string类型
   */
  const compTheme = computed(() => {
    const themes = props.theme?.split(/\s+/) ?? [];
    themes.sort((a: string, b: string) => Number(themeList.includes(b)) - (Number(themeList.includes(a))));
    const systemThemes = themes;
    const customThemes = themes.filter((item: string) => !themeList.includes(item));
    return { systemThemes, customThemes };
  });

  const isHideMiddlewareAvailable = () => props.autoVisibility;
  const isAutoPlacementAvailable = () => props.autoPlacement;

  /**
   * 解析弹出reference元素，content元素， arrow元素
   * @returns
   */
  const resolvePopElements = () => {
    const elReference = resolveTargetElement(refReference.value?.$el);
    const elContent = resolveTargetElement(refContent.value?.$el);
    const elArrow = props.arrow ? resolveTargetElement(refArrow.value?.$el) : null;
    const root = resolveTargetElement(refRoot.value?.$el);
    return { elReference, elContent, elArrow, root };
  };

  const resolveModifiers: any = () => {
    const resolveResult = {};
    if (Array.isArray(props.modifiers)) {
      props.modifiers.forEach((m: any) => {
        let result;
        if (m.name === 'offset') {
          if (typeof m.options?.offset === 'number') {
            result = m.options?.offset;
          }

          if (Array.isArray(m.options?.offset)) {
            const [mainAxis, crossAxis] = m.options?.offset;
            result = { mainAxis, crossAxis };
          }

          Object.assign(resolveResult, { offset: result });
        }
      });
    }

    return resolveResult;
  };

  const resolvePopOptions = (elArrow, props) => {
    const modifiers = resolveModifiers();

    const middleware = [
      offset(modifiers.offset || props.offset),
      shift({ padding: props.padding }),
    ];
    const options = {
      placement: props.placement as Placement,
      middleware,
    };

    if (props.arrow) {
      middleware.push(arrow({ element: elArrow }));
    }

    if (isAutoPlacementAvailable()) {
      middleware.push(autoPlacement());
    } else {
      middleware.unshift(inline());
      middleware.push(flip());
    }

    if (isHideMiddlewareAvailable()) {
      options.middleware.push(hide());
    }

    /**
     * 如果是全屏元素或者指定的虚拟元素
     * 则启用自定义的platform
     * 在弹出的全屏元素中，元素相对位置有别于document下面元素
     * 全屏模式下面，需要自定义当前元素的一个platform
     */
    if (isElementFullScreen() || props.isVirtualEl) {
      const  {
        getElementRects,
        getDimensions,
        getClippingRect,
      } = usePlatform(fullScreenTarget.value);

      Object.assign(options, {
        platform: {
          ...(props?.platform ?? {}),
          getElementRects,
          getDimensions,
          getClippingRect,
        },
      });
    }
    return options;
  };

  const resolveTargetElement = (target: any) => {
    if (target instanceof HTMLElement) {
      return target;
    }

    if (target instanceof Text) {
      return resolveTargetElement(target.nextElementSibling);
    }

    if (typeof target?.getBoundingClientRect === 'function') {
      return target;
    }

    return null;
  };

  // 兼容多种样式处理规则
  // class custom-theme
  const customThemeCls = compTheme.value.customThemes.join(' ');
  const customTheme = compTheme.value.customThemes.reduce((out, cur) => ({ [`data-${cur}-theme`]: true, ...out }), {});
  const contentClass = `${customThemeCls}`;

  let cleanup = null;

  const getRoundPixelVal = (val: number) => {
    const dpr = window.devicePixelRatio || 1;
    return Math.round(val * dpr) / dpr || 0;
  };

  const updatePopContentStyle = (elContent, x, y, middlewareData) => {
    if (props.disableTransform) {
      Object.assign(elContent.style, {
        left: `${getRoundPixelVal(x)}px`,
        top: `${getRoundPixelVal(y)}px`,
      });
    } else {
      Object.assign(elContent.style, {
        left: '0',
        top: '0',
        transform: `translate3d(${getRoundPixelVal(x)}px,${getRoundPixelVal(y)}px,0)`,
      });
    }

    const referenceHidden = isHideMiddlewareAvailable() ? middlewareData.hide?.referenceHidden : false;
    Object.assign(elContent.style, {
      visibility: referenceHidden ? 'hidden' : 'visible',
    });
  };

  const updateArrowStyle = (elArrow, resolvedPlacement, middlewareData) => {
    if (props.arrow) {
      const { x: arrowX, y: arrowY } = middlewareData.arrow ?? {};
      elArrow.setAttribute('data-arrow', resolvedPlacement);
      const arrowConfig = {
        left: '',
        top: '',
        bottom: '',
        right: '',
      };
      Object.assign(elArrow.style, arrowConfig);

      const arrowSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[resolvedPlacement];
      Object.assign(elArrow.style, {
        left: arrowX !== null ? `${arrowX}px` : '',
        top: arrowY !== null ? `${arrowY}px` : '',
        [arrowSide]: '-4px',
      });
    }
  };

  const createPopInstance = () => {
    const { elReference, elContent } = resolvePopElements();
    cleanup = autoUpdate(elReference, elContent, () => {
      if (localIsShow.value) {
        updatePopover(null, props);
      }
    });
  };


  const updatePopover = (virtualEl = null, props = {}) => {
    const { elReference, elContent, elArrow } = resolvePopElements();
    const targetEl = virtualEl || elReference;
    if (!targetEl || !elContent) return;
    const options = resolvePopOptions(elArrow, props);
    computePosition(targetEl, elContent, options).then(({ x, y, placement, middlewareData }) => {
      const oldClass = elContent.className;
      elContent.className = `${oldClass.replace(contentClass, '')} ${contentClass}`.replace(/\s+/mg, ' ').replace(/^\s+|\s+$/g, '');
      Object.keys(customTheme).forEach((key: string) => {
        elContent.setAttribute(key, customTheme[key]);
      });

      const placementStr = placement.split('-')[0];
      let resolvedPlacement = placementStr;
      if (!['left', 'right', 'top', 'bottom'].includes(placementStr)) {
        resolvedPlacement = 'top';
      }

      updatePopContentStyle(elContent, x, y, middlewareData);
      updateArrowStyle(elArrow, resolvedPlacement, middlewareData);
    });
  };

  let popHideTimerId = undefined;
  let popShowTimerId = undefined;
  let isMouseenter = false;

  const resolvePopoverDelay = () => {
    if (Array.isArray(props.popoverDelay)) {
      return [props.popoverDelay[0], props.popoverDelay.slice(-1)[0]];
    }

    return [props.popoverDelay, props.popoverDelay];
  };

  const showPopover = () => {
    const delay = resolvePopoverDelay()[0];
    // 设置settimeout避免hidePopover导致显示问题
    popShowTimerId = setTimeout(() => {
      if (popHideTimerId) {
        clearTimeout(popHideTimerId);
      }
      if (!props.disabled) {
        localIsShow.value = true;
      }
    }, delay);
  };

  const hidePopover = () => {
    const delay = resolvePopoverDelay()[1];
    popHideTimerId = setTimeout(() => {
      popShowTimerId && clearTimeout(popShowTimerId);
      localIsShow.value = false;
    }, delay);
  };

  const hanldePopoverShow = () => {
    const elContent = resolveTargetElement(refContent.value?.$el) as HTMLElement;
    elContent.style.setProperty('display', 'block');
    elContent.style.setProperty('z-index', `${props.zIndex ? props.zIndex : bkZIndexManager.getPopperIndex()}`);
    updatePopover();
    ctx.emit('afterShow', { isShow: true });
  };

  const handlePopoverHide = () => {
    const elContent = resolveTargetElement(refContent.value?.$el);
    elContent.style.setProperty('display', 'none');
    ctx.emit('afterHidden', { isShow: false });
  };

  const triggerPopover = () => {
    if (!localIsShow.value) {
      showPopover();
    } else {
      hidePopover();
    }
  };

  const handleClickRef = () => {
    triggerPopover();
  };

  const handlePopContentMouseEnter = () => {
    if (props.trigger !== 'hover') {
      return;
    }

    if (popHideTimerId) {
      isMouseenter = true;
      clearTimeout(popHideTimerId);
      popHideTimerId = undefined;
    }

    emitPopContentMouseEnter();
  };

  const handlePopContentMouseLeave = () => {
    if (isMouseenter) {
      hidePopover();
      isMouseenter = false;
      emitPopContentMouseLeave();
    }
  };

  /**
   * 弹出内容鼠标移入事件
   * 抛出相关事件，方便后续操作
   * 例如：鼠标移入内容区域，则取消弹出内容隐藏操作
   */
  const emitPopContentMouseEnter = () => {
    ctx.emit(EMIT_EVENTS.CONTENT_MOUSEENTER);
  };

  /**
   * 弹出内容鼠标移出事件
   */
  const emitPopContentMouseLeave = () => {
    ctx.emit(EMIT_EVENTS.CONTENT_MOUSELEAVE);
  };

  const resolveTriggerEvents = () => {
    const triggerEvents = {
      hover: {
        content: [
          ['mouseenter', handlePopContentMouseEnter],
          ['mouseleave', handlePopContentMouseLeave],
        ],
        reference: [
          ['mouseenter', showPopover],
          ['mouseleave', hidePopover],
          ['focus', showPopover],
          ['blur', hidePopover],
        ],
      },
      click: [['click', handleClickRef]],
      manual: {
        content: [
          ['mouseenter', emitPopContentMouseEnter],
          ['mouseleave', emitPopContentMouseLeave],
        ],
        reference: [[]],
      },
    };

    return triggerEvents[props.trigger] ?? [];
  };

  const updateFullscreenTarget = (val?: HTMLElement) => {
    fullScreenTarget.value = val;
  };

  watch(() => props.isShow, (val) => {
    localIsShow.value = val;
  });

  watch(localIsShow, (val) => {
    if (val) {
      hanldePopoverShow();
    } else {
      handlePopoverHide();
    }
  });

  const stopHide = () => {
    if (popHideTimerId) {
      isMouseenter = true;
      clearTimeout(popHideTimerId);
      popHideTimerId = undefined;
    }
  };

  return {
    showPopover,
    hidePopover,
    resolveTriggerEvents,
    updatePopover,
    triggerPopover,
    resolvePopElements,
    isElementFullScreen,
    resolveTargetElement,
    createPopInstance,
    updateFullscreenTarget,
    getFullscreenRoot,
    stopHide,
    localIsShow,
    cleanup,
  };
};
