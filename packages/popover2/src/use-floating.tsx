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

import { PopoverPropTypes } from './props';
import usePlatform from './use-platform';


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

  const themeList = ['dark', 'light'];
  const compTheme = computed(() => {
    const themes = props.theme?.split(/\s+/) ?? [];
    themes.sort((a: string, b: string) => Number(themeList.includes(b)) - (Number(themeList.includes(a))));
    const systemThemes = themes;
    const customThemes = themes.filter((item: string) => !themeList.includes(item));
    return { systemThemes, customThemes };
  });

  const isHideMiddlewareAvailable = () => !isElementFullScreen() && props.autoVisibility;
  const isAutoPlacemntAvailable = () => isElementFullScreen() || props.autoPlacement;
  const resolvePopElements = () => {
    const elReference = resolveTargetElement(refReference.value?.$el);
    const elContent = resolveTargetElement(refContent.value?.$el);
    const elArrow = props.arrow ? resolveTargetElement(refArrow.value?.$el) : null;
    const root = resolveTargetElement(refRoot.value?.$el);
    return { elReference, elContent, elArrow, root };
  };

  const resolvePopOptions = (elArrow, props) => {
    const middleware = [
      offset(props.offset),
      shift({ padding: props.padding }),
    ];
    const options = {
      placement: props.placement as Placement,
      middleware,
    };

    if (props.arrow) {
      middleware.push(arrow({ element: elArrow }));
    }

    if (isAutoPlacemntAvailable()) {
      middleware.push(autoPlacement());
    } else {
      middleware.unshift(inline());
      middleware.push(flip());
    }

    if (isHideMiddlewareAvailable()) {
      options.middleware.push(hide());
    }

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
      updatePopover(null, props);
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

  const showPopover = () => {
    !props.disabled && (localIsShow.value = true);
  };

  let popShowTimerId = undefined;
  let isMouseenter = false;

  const hidePopover = () => {
    popShowTimerId = setTimeout(() => {
      localIsShow.value = false;
    }, 100);
  };

  const hanldePopoverShow = () => {
    const elContent = resolveTargetElement(refContent.value?.$el) as HTMLElement;
    elContent.style.setProperty('display', 'block');
    elContent.style.setProperty('z-index', `${props.zIndex ? props.zIndex : bkZIndexManager.getModalNextIndex()}`);
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

  const hanldeClickRef = () => {
    triggerPopover();
  };

  const handlePopContentMouseEnter = () => {
    if (props.trigger !== 'hover') {
      return;
    }

    if (popShowTimerId) {
      isMouseenter = true;
      clearTimeout(popShowTimerId);
      popShowTimerId = undefined;
    }
  };

  const handlePopContentMouseLeave = () => {
    if (isMouseenter) {
      hidePopover();
      isMouseenter = false;
    }
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
      click: [['click', hanldeClickRef]],
      manual: [[]],
    };

    return triggerEvents[props.trigger] ?? [];
  };

  const updateFullscreenTarget = (val?: HTMLElement) => {
    fullScreenTarget.value = val;
  };

  watch(localIsShow, (val) => {
    if (val) {
      hanldePopoverShow();
    } else {
      handlePopoverHide();
    }
  });

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
    localIsShow,
    cleanup,
  };
};
