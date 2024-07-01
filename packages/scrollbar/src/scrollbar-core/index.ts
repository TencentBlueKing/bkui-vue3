/* eslint-disable @typescript-eslint/consistent-type-assertions */
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
import { debounce, throttle } from 'lodash';

import canUseDOM from './can-use-dom';
import * as helpers from './helpers';
import resolveWheelEvent from './mouse-wheel';
import scrollbarWidth from './scrollbar-width';

interface DebouncedFunc<T extends (...args) => void> {
  /**
   * Call the original function, but applying the debounce rules.
   *
   * If the debounced function can be run immediately, this calls it and returns its return
   * value.
   *
   * Otherwise, it returns the return value of the last invocation, or undefined if the debounced
   * function was not invoked yet.
   */
  (...args: Parameters<T>): ReturnType<T> | undefined;

  /**
   * Throw away any pending invocation of the debounced function.
   */
  cancel(): void;

  /**
   * If there is a pending invocation of the debounced function, invoke it immediately and return
   * its return value.
   *
   * Otherwise, return the value from the last invocation, or undefined if the debounced function
   * was never invoked.
   */
  flush(): ReturnType<T> | undefined;
}

export interface Options {
  forceVisible: Axis | boolean;
  clickOnTrack: boolean;
  scrollbarMinSize: number;
  scrollbarMaxSize: number;
  classNames: Partial<ClassNames>;
  ariaLabel: string;
  contentNode: HTMLElement | null;
  delegateYContent: HTMLElement | null;
  delegateXContent: HTMLElement | null;
  wrapperNode: HTMLElement | null;
  autoHide: boolean;
  useSystemScrollXBehavior?: boolean;
  useSystemScrollYBehavior?: boolean;
  size: 'default' | 'small';
  scrollDelegate: {
    scrollHeight?: number;
    scrollWidth?: number;
  };
  onScrollCallback?: (args: { x: number; y: number }) => void;
}

export type BkScrollBarOptions = Partial<Options>;

type ClassNames = {
  contentEl: string;
  offset: string;
  mask: string;
  wrapper: string;
  placeholder: string;
  scrollbar: string;
  track: string;

  visible: string;
  horizontal: string;
  vertical: string;
  hover: string;
  dragging: string;
  scrolling: string;
  scrollable: string;
  mouseEntered: string;
};

type Axis = 'x' | 'y';
type AxisProps = {
  scrollOffsetAttr: 'scrollLeft' | 'scrollTop';
  sizeAttr: 'height' | 'width';
  scrollSizeAttr: 'scrollHeight' | 'scrollWidth';
  offsetSizeAttr: 'offsetHeight' | 'offsetWidth';
  offsetAttr: 'left' | 'top';
  overflowAttr: 'overflowX' | 'overflowY';
  dragOffset: number;
  isOverflowing: boolean;
  forceVisible: boolean;
  track: {
    size: number;
    el: HTMLElement | null;
    rect: DOMRect | null;
    isVisible: boolean;
  };
  scrollbar: {
    size: number;
    el: HTMLElement | null;
    rect: DOMRect | null;
    isVisible: boolean;
  };
};
type RtlHelpers = {
  // determines if the scrolling is responding with negative values
  isScrollOriginAtZero: boolean;
  // determines if the origin scrollbar position is inverted or not (positioned on left or right)
  isScrollingToNegative: boolean;
} | null;
type DefaultOptions = Options & typeof BkScrollbarCore.defaultOptions;

type MouseWheelInstance = {
  addWheelEvent: (target: HTMLElement) => void;
  removeWheelEvent: (target: HTMLElement) => void;
};

const { getElementWindow, getElementDocument, addClasses, removeClasses, classNamesToQuery } = helpers;

export default class BkScrollbarCore {
  static rtlHelpers: RtlHelpers = null;

  static defaultOptions: Options = {
    forceVisible: false,
    clickOnTrack: true,
    scrollbarMinSize: 25,
    scrollbarMaxSize: 0,
    ariaLabel: 'scrollable content',
    size: 'default',
    classNames: {
      contentEl: 'bk-content',
      wrapper: 'bk-wrapper',
      scrollbar: 'bk-scrollbar',
      track: 'bk-track',
      visible: 'bk-visible',
      horizontal: 'bk-horizontal',
      vertical: 'bk-vertical',
      hover: 'bk-hover',
      dragging: 'bk-dragging',
      scrolling: 'bk-scrolling',
      scrollable: 'bk-scrollable',
      mouseEntered: 'bk-mouse-entered',
    },
    contentNode: null,
    wrapperNode: null,
    /**
     * 如果是自定义虚拟滚动，content可能是position absolute，此时需要一个实际支撑的元素
     */
    delegateXContent: null,
    delegateYContent: null,
    autoHide: true,
    /**
     * X轴或者Y轴是否启用默认的滚动条功能
     */
    useSystemScrollXBehavior: true,
    useSystemScrollYBehavior: true,
    onScrollCallback: null,

    scrollDelegate: {
      scrollHeight: null,
      scrollWidth: null,
    },
  };

  /**
   * Static functions
   */

  static helpers = helpers;

  /**
   * Helper to fix browsers inconsistency on RTL:
   *  - Firefox inverts the scrollbar initial position
   *  - IE11 inverts both scrollbar position and scrolling offset
   */
  static getRtlHelpers() {
    if (BkScrollbarCore.rtlHelpers) {
      return BkScrollbarCore.rtlHelpers;
    }

    const dummyDiv = document.createElement('div');
    dummyDiv.innerHTML = '<div class="bk-dummy-scrollbar-size"><div></div></div>';

    const scrollbarDummyEl = dummyDiv.firstElementChild;
    const dummyChild = scrollbarDummyEl?.firstElementChild;

    if (!dummyChild) return null;

    document.body.appendChild(scrollbarDummyEl);

    scrollbarDummyEl.scrollLeft = 0;

    const dummyContainerOffset = BkScrollbarCore.getOffset(scrollbarDummyEl);
    const dummyChildOffset = BkScrollbarCore.getOffset(dummyChild);

    scrollbarDummyEl.scrollLeft = -999;
    const dummyChildOffsetAfterScroll = BkScrollbarCore.getOffset(dummyChild);

    document.body.removeChild(scrollbarDummyEl);

    BkScrollbarCore.rtlHelpers = {
      // determines if the scrolling is responding with negative values
      isScrollOriginAtZero: dummyContainerOffset.left !== dummyChildOffset.left,
      // determines if the origin scrollbar position is inverted or not (positioned on left or right)
      isScrollingToNegative: dummyChildOffset.left !== dummyChildOffsetAfterScroll.left,
    };

    return BkScrollbarCore.rtlHelpers;
  }

  static getOffset(el: Element) {
    const rect = el.getBoundingClientRect();
    const elDocument = getElementDocument(el);
    const elWindow = getElementWindow(el);

    return {
      top: rect.top + (elWindow.pageYOffset || elDocument.documentElement.scrollTop),
      left: rect.left + (elWindow.pageXOffset || elDocument.documentElement.scrollLeft),
    };
  }

  el: HTMLElement;
  options: DefaultOptions;
  classNames: ClassNames;
  axis: {
    x: AxisProps;
    y: AxisProps;
  };
  draggedAxis?: Axis;
  removePreventClickId: null | number = null;
  minScrollbarWidth = 8;
  stopScrollDelay = 175;
  isScrolling = false;
  isMouseEntering = false;
  isDragging = false;
  scrollXTicking = false;
  scrollYTicking = false;
  wrapperEl: HTMLElement | null = null;
  contentEl: HTMLElement | null = null;
  delegateXContent: HTMLElement | null = null;
  delegateYContent: HTMLElement | null = null;

  rtlHelpers: RtlHelpers = null;
  scrollbarWidth = 0;
  resizeObserver: ResizeObserver | null = null;
  mutationObserver: MutationObserver | null = null;
  elStyles: CSSStyleDeclaration | null = null;
  isRtl: boolean | null = null;
  mouseX = 0;
  mouseY = 0;
  mouseWheelInstance: MouseWheelInstance = null;
  wheelOffsetY = 0;
  wheelOffsetX = 0;

  mouseWeelTimer;
  /**
   * 最外层滚动容器滚动实际位置缓存器
   */
  wrapperScrollValue = {
    scrollTop: 0,
    scrollLeft: 0,
  };

  /**
   * 模拟滚动条内部缩略滚动器滚动位置缓存器
   */
  wrapperScrollMap = {};

  onMouseMove: (() => void) | DebouncedFunc<(...args) => void> = () => {};
  onWindowResize: (() => void) | DebouncedFunc<(...args) => void> = () => {};
  onStopScrolling: (() => void) | DebouncedFunc<(...args) => void> = () => {};
  onMouseEntered: (() => void) | DebouncedFunc<(...args) => void> = () => {};
  onMouseWheel: (() => void) | DebouncedFunc<(...args) => void> = () => {};

  // eslint-disable-next-line @typescript-eslint/member-ordering
  constructor(element: HTMLElement, options: Partial<Options> = {}) {
    this.el = element;
    this.options = { ...BkScrollbarCore.defaultOptions, ...options };
    this.classNames = {
      ...BkScrollbarCore.defaultOptions.classNames,
      ...options.classNames,
    } as ClassNames;
    this.axis = {
      x: {
        scrollOffsetAttr: 'scrollLeft',
        sizeAttr: 'width',
        scrollSizeAttr: 'scrollWidth',
        offsetSizeAttr: 'offsetWidth',
        offsetAttr: 'left',
        overflowAttr: 'overflowX',
        dragOffset: 0,
        isOverflowing: true,
        forceVisible: false,
        track: { size: null, el: null, rect: null, isVisible: false },
        scrollbar: { size: null, el: null, rect: null, isVisible: false },
      },
      y: {
        scrollOffsetAttr: 'scrollTop',
        sizeAttr: 'height',
        scrollSizeAttr: 'scrollHeight',
        offsetSizeAttr: 'offsetHeight',
        offsetAttr: 'top',
        overflowAttr: 'overflowY',
        dragOffset: 0,
        isOverflowing: true,
        forceVisible: false,
        track: { size: null, el: null, rect: null, isVisible: false },
        scrollbar: { size: null, el: null, rect: null, isVisible: false },
      },
    };

    if (typeof this.el !== 'object' || !this.el.nodeName) {
      throw new Error(`Argument passed to SimpleBar must be an HTML element instead of ${this.el}`);
    }

    this.onMouseMove = throttle(this.mOnMouseMove, 64);
    this.onWindowResize = debounce(this.mOnWindowResize, 64);
    this.onStopScrolling = debounce(this.mOnStopScrolling, 64);
    this.onMouseEntered = debounce(this.mOnMouseEntered, 64);
    this.mouseWheelInstance = resolveWheelEvent(this.mOnMouseWheel);

    this.init();
  }

  getScrollbarWidth() {
    // Try/catch for FF 56 throwing on undefined computedStyles
    try {
      // Detect browsers supporting CSS scrollbar styling and do not calculate
      if (
        (this.wrapperEl && getComputedStyle(this.wrapperEl, '::-webkit-scrollbar').display === 'none') ||
        'scrollbarWidth' in document.documentElement.style ||
        '-ms-overflow-style' in document.documentElement.style
      ) {
        return 0;
      }
      return scrollbarWidth();
    } catch (e) {
      return scrollbarWidth();
    }
  }

  init() {
    // We stop here on server-side
    if (canUseDOM) {
      this.initDOM();

      this.rtlHelpers = BkScrollbarCore.getRtlHelpers();
      this.scrollbarWidth = this.getScrollbarWidth();

      this.recalculate();

      this.initListeners();
    }
  }

  initDOM() {
    // assume that element has his DOM already initiated
    this.wrapperEl = this.options.wrapperNode ?? this.el.querySelector(classNamesToQuery(this.classNames.wrapper));
    this.contentEl = this.options.contentNode ?? this.el.querySelector(classNamesToQuery(this.classNames.contentEl));
    this.axis.x.track.el = this.findChild(
      this.el,
      `${classNamesToQuery(this.classNames.track)}${classNamesToQuery(this.classNames.horizontal)}`,
    );
    this.axis.y.track.el = this.findChild(
      this.el,
      `${classNamesToQuery(this.classNames.track)}${classNamesToQuery(this.classNames.vertical)}`,
    );

    this.axis.x.scrollbar.el =
      this.axis.x.track.el?.querySelector(classNamesToQuery(this.classNames.scrollbar)) || null;
    this.axis.y.scrollbar.el =
      this.axis.y.track.el?.querySelector(classNamesToQuery(this.classNames.scrollbar)) || null;

    if (!this.options.autoHide) {
      addClasses(this.axis.x.scrollbar.el, this.classNames.visible);
      addClasses(this.axis.y.scrollbar.el, this.classNames.visible);
    }
  }

  initListeners() {
    const elWindow = getElementWindow(this.el);
    // Event listeners

    this.mouseWheelInstance?.addWheelEvent(this.el);

    this.el.addEventListener('mouseenter', this.onMouseEnter);

    this.el.addEventListener('pointerdown', this.onPointerEvent, true);

    this.el.addEventListener('mousemove', this.onMouseMove);
    this.el.addEventListener('mouseleave', this.onMouseLeave);

    // Browser zoom triggers a window resize
    elWindow.addEventListener('resize', this.onWindowResize);

    if (!this.contentEl) return;

    if (window.ResizeObserver) {
      // Hack for https://github.com/WICG/ResizeObserver/issues/38
      let resizeObserverStarted = false;
      const resizeObserver = elWindow.ResizeObserver || ResizeObserver;

      this.resizeObserver = new resizeObserver(() => {
        if (!resizeObserverStarted) return;

        elWindow.requestAnimationFrame(() => {
          this.recalculate();
        });
      });

      this.resizeObserver.observe(this.el);
      this.resizeObserver.observe(this.contentEl);
      if (this.delegateXContent) {
        this.resizeObserver.observe(this.delegateXContent);
      }

      if (this.delegateYContent) {
        this.resizeObserver.observe(this.delegateYContent);
      }

      elWindow.requestAnimationFrame(() => {
        resizeObserverStarted = true;
      });
    }

    // This is required to detect horizontal scroll. Vertical scroll only needs the resizeObserver.
    this.mutationObserver = new elWindow.MutationObserver(() => {
      elWindow.requestAnimationFrame(() => {
        this.recalculate();
      });
    });

    this.mutationObserver.observe(this.contentEl, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  getWrapperElScrollSize(attrName: string, target = this.wrapperEl) {
    if (this.options.scrollDelegate[attrName]) {
      return this.options.scrollDelegate[attrName];
    }

    return target?.[attrName] ?? 0;
  }

  recalculate() {
    if (!this.contentEl || !this.wrapperEl) return;

    const elWindow = getElementWindow(this.el);
    this.elStyles = elWindow.getComputedStyle(this.el);
    this.isRtl = this.elStyles.direction === 'rtl';

    const wrapperOffsetWidth = this.wrapperEl.offsetWidth;
    const wrapperOffsetHeight = this.wrapperEl.offsetHeight;

    const wrapperScrollHeight = this.getWrapperElScrollSize('scrollHeight'); // this.wrapperEl.scrollHeight;
    const wrapperScrollWidth = this.getWrapperElScrollSize('scrollWidth'); // this.wrapperEl.scrollWidth;

    this.axis.x.isOverflowing = wrapperOffsetWidth !== 0 && wrapperScrollWidth - wrapperOffsetWidth > 2;
    this.axis.y.isOverflowing = wrapperScrollHeight - wrapperOffsetHeight > 2;

    this.axis.x.forceVisible = this.options.forceVisible === 'x' || this.options.forceVisible === true;
    this.axis.y.forceVisible = this.options.forceVisible === 'y' || this.options.forceVisible === true;

    // Set isOverflowing to false if scrollbar is not necessary (content is shorter than offset)
    const offsetForXScrollbar = this.axis.x.isOverflowing ? this.scrollbarWidth : 0;
    const offsetForYScrollbar = this.axis.y.isOverflowing ? this.scrollbarWidth : 0;

    this.axis.x.isOverflowing =
      this.axis.x.isOverflowing && wrapperScrollWidth > wrapperOffsetWidth - offsetForYScrollbar;
    this.axis.y.isOverflowing =
      this.axis.y.isOverflowing && wrapperScrollHeight > wrapperOffsetHeight - offsetForXScrollbar;

    this.axis.x.scrollbar.size = this.getScrollbarSize('x');
    this.axis.y.scrollbar.size = this.getScrollbarSize('y');

    if (this.axis.x.scrollbar.el) this.axis.x.scrollbar.el.style.width = `${this.axis.x.scrollbar.size}px`;
    if (this.axis.y.scrollbar.el) this.axis.y.scrollbar.el.style.height = `${this.axis.y.scrollbar.size}px`;

    this.positionScrollbar('x');
    this.positionScrollbar('y');

    this.toggleTrackVisibility('x');
    this.toggleTrackVisibility('y');
  }

  /**
   * Calculate scrollbar size
   */
  getScrollbarSize(axis: Axis = 'y') {
    if (!this.axis[axis].isOverflowing || !this.contentEl) {
      return 0;
    }

    const getContentTarget = () => {
      if (axis === 'x') {
        return this.options.delegateXContent ?? this.contentEl;
      }

      return this.options.delegateYContent ?? this.contentEl;
    };

    const contentSize = this.getWrapperElScrollSize(this.axis[axis].scrollSizeAttr, getContentTarget());
    const trackSize = this.axis[axis].track.el?.[this.axis[axis].offsetSizeAttr] ?? 0;
    const scrollbarRatio = trackSize / contentSize;

    let scrollbarSize;

    // Calculate new height/position of drag handle.
    scrollbarSize = Math.max(~~(scrollbarRatio * trackSize), this.options.scrollbarMinSize);

    if (this.options.scrollbarMaxSize) {
      scrollbarSize = Math.min(scrollbarSize, this.options.scrollbarMaxSize);
    }

    return scrollbarSize;
  }

  positionScrollbar(axis: Axis = 'y') {
    const { scrollbar } = this.axis[axis];

    if (!this.axis[axis].isOverflowing || !this.wrapperEl || !scrollbar.el || !this.elStyles) {
      return;
    }

    const contentSize = this.getWrapperElScrollSize(this.axis[axis].scrollSizeAttr);
    const trackSize = this.axis[axis].track.el?.[this.axis[axis].offsetSizeAttr] || 0;
    const hostSize = parseInt(this.elStyles[this.axis[axis].sizeAttr], 10);

    let scrollOffset = this.wrapperScrollValue[this.axis[axis].scrollOffsetAttr];

    scrollOffset =
      axis === 'x' && this.isRtl && BkScrollbarCore.getRtlHelpers()?.isScrollOriginAtZero
        ? -scrollOffset
        : scrollOffset;

    if (axis === 'x' && this.isRtl) {
      scrollOffset = BkScrollbarCore.getRtlHelpers()?.isScrollingToNegative ? scrollOffset : -scrollOffset;
    }

    const scrollPourcent = scrollOffset / (contentSize - hostSize);

    let handleOffset = ~~((trackSize - scrollbar.size) * scrollPourcent);
    handleOffset = axis === 'x' && this.isRtl ? -handleOffset + (trackSize - scrollbar.size) : handleOffset;

    const scrollAttr = this.axis[axis].scrollOffsetAttr;
    Object.assign(this.wrapperScrollMap, { [scrollAttr]: handleOffset });

    scrollbar.el.style.transform =
      axis === 'x' ? `translate3d(${handleOffset}px, 0, 0)` : `translate3d(0, ${handleOffset}px, 0)`;

    // const translateAxis = axis === 'x' ? 'translateX' : 'translateY';
    // anime({
    //   targets: scrollbar.el,
    //   [translateAxis]: handleOffset,
    //   duration: 300,
    //   easing: 'easeOutQuad',
    //   complete: () => {
    //     this.options?.onScrollCallback?.({
    //       x: this.wrapperScrollValue.scrollLeft,
    //       y: this.wrapperScrollValue.scrollTop,
    //     });
    //   },
    // });

    // if (!this.isDragging) {
    //   const translateAxis = axis === 'x' ? 'translateX' : 'translateY';
    //   anime({
    //     targets: scrollbar.el,
    //     [translateAxis]: handleOffset,
    //     duration: 300,
    //     easing: 'easeOutQuad',
    //     complete: () => {
    //       this.options?.onScrollCallback?.({
    //         x: this.wrapperScrollValue.scrollLeft,
    //         y: this.wrapperScrollValue.scrollTop,
    //       });
    //     },
    //   });
    // } else {
    //   scrollbar.el.style.transform =
    //     axis === 'x' ? `translate3d(${handleOffset}px, 0, 0)` : `translate3d(0, ${handleOffset}px, 0)`;
    // }
  }

  toggleTrackVisibility(axis: Axis = 'y') {
    const track = this.axis[axis].track.el;
    const scrollbar = this.axis[axis].scrollbar.el;

    if (!track || !scrollbar || !this.wrapperEl) return;
    if (this.axis[axis].isOverflowing || this.axis[axis].forceVisible) {
      track.style.visibility = 'visible';
      this.el.classList.add(`${this.classNames.scrollable}-${axis}`);
    } else {
      track.style.visibility = 'hidden';
      this.el.classList.remove(`${this.classNames.scrollable}-${axis}`);
    }

    // Even if forceVisible is enabled, scrollbar itself should be hidden
    if (this.axis[axis].isOverflowing) {
      scrollbar.style.display = 'block';
    } else {
      scrollbar.style.display = 'none';
    }
  }

  showScrollbar(axis: Axis = 'y') {
    if (this.axis[axis].isOverflowing && !this.axis[axis].scrollbar.isVisible) {
      addClasses(this.axis[axis].scrollbar.el, this.classNames.visible);
      this.axis[axis].scrollbar.isVisible = true;
    }
  }

  hideScrollbar(axis: Axis = 'y') {
    if (this.isDragging) return;
    if (this.axis[axis].isOverflowing && this.axis[axis].scrollbar.isVisible) {
      removeClasses(this.axis[axis].scrollbar.el, this.classNames.visible);
      this.axis[axis].scrollbar.isVisible = false;
    }
  }

  /**
   * On scroll event handling
   */
  onScroll = () => {
    const elWindow = getElementWindow(this.el);

    if (!this.scrollXTicking) {
      elWindow.requestAnimationFrame(this.scrollX);
      this.scrollXTicking = true;
    }

    if (!this.scrollYTicking) {
      elWindow.requestAnimationFrame(this.scrollY);
      this.scrollYTicking = true;
    }

    if (!this.isScrolling) {
      this.isScrolling = true;
      addClasses(this.el, this.classNames.scrolling);
    }

    this.showScrollbar('x');
    this.showScrollbar('y');

    this.onStopScrolling();
  };

  scrollX = () => {
    if (this.axis.x.isOverflowing) {
      this.positionScrollbar('x');
    }

    this.scrollXTicking = false;
  };

  scrollY = () => {
    if (this.axis.y.isOverflowing) {
      this.positionScrollbar('y');
    }

    this.scrollYTicking = false;
  };

  onMouseEnter = () => {
    this.mouseWeelTimer && clearTimeout(this.mouseWeelTimer);
    if (!this.isMouseEntering) {
      addClasses(this.el, this.classNames.mouseEntered);
      this.showScrollbar('x');
      this.showScrollbar('y');
      this.isMouseEntering = true;
    }
    this.onMouseEntered();
  };

  onMouseMoveForAxis(axis: Axis = 'y') {
    const currentAxis = this.axis[axis];
    if (!currentAxis.track.el || !currentAxis.scrollbar.el) return;

    currentAxis.track.rect = currentAxis.track.el.getBoundingClientRect();
    currentAxis.scrollbar.rect = currentAxis.scrollbar.el.getBoundingClientRect();

    if (this.isWithinBounds(currentAxis.track.rect)) {
      this.showScrollbar(axis);
      addClasses(currentAxis.track.el, this.classNames.hover);

      if (this.isWithinBounds(currentAxis.scrollbar.rect)) {
        addClasses(currentAxis.scrollbar.el, this.classNames.hover);
      } else {
        if (!this.isDragging) {
          removeClasses(currentAxis.scrollbar.el, this.classNames.hover);
        }
      }
    } else {
      if (!this.isDragging) {
        removeClasses(currentAxis.track.el, this.classNames.hover);
      }
      if (this.options.autoHide) {
        this.hideScrollbar(axis);
      }
    }
  }

  onMouseLeave = () => {
    (this.onMouseMove as DebouncedFunc<(...args) => void>).cancel();

    if (this.axis.x.isOverflowing || this.axis.x.forceVisible) {
      this.onMouseLeaveForAxis('x');
    }

    if (this.axis.y.isOverflowing || this.axis.y.forceVisible) {
      this.onMouseLeaveForAxis('y');
    }

    this.mouseX = -1;
    this.mouseY = -1;
  };

  onMouseLeaveForAxis(axis: Axis = 'y') {
    if (this.isDragging) {
      return;
    }
    removeClasses(this.axis[axis].track.el, this.classNames.hover);
    removeClasses(this.axis[axis].scrollbar.el, this.classNames.hover);
    if (this.options.autoHide) {
      this.hideScrollbar(axis);
    }
  }

  onPointerEvent = (e: PointerEvent) => {
    if (!this.axis.x.track.el || !this.axis.y.track.el || !this.axis.x.scrollbar.el || !this.axis.y.scrollbar.el)
      return;

    let isWithinTrackXBounds;
    let isWithinTrackYBounds;

    this.axis.x.track.rect = this.axis.x.track.el.getBoundingClientRect();
    this.axis.y.track.rect = this.axis.y.track.el.getBoundingClientRect();

    if (this.axis.x.isOverflowing || this.axis.x.forceVisible) {
      isWithinTrackXBounds = this.isWithinBounds(this.axis.x.track.rect);
    }

    if (this.axis.y.isOverflowing || this.axis.y.forceVisible) {
      isWithinTrackYBounds = this.isWithinBounds(this.axis.y.track.rect);
    }

    // If any pointer event is called on the scrollbar
    if (isWithinTrackXBounds || isWithinTrackYBounds) {
      // Prevent event leaking
      e.stopPropagation();

      if (e.type === 'pointerdown' && e.pointerType !== 'touch') {
        if (isWithinTrackXBounds) {
          this.axis.x.scrollbar.rect = this.axis.x.scrollbar.el.getBoundingClientRect();

          if (this.isWithinBounds(this.axis.x.scrollbar.rect)) {
            this.onDragStart(e, 'x');
          } else {
            this.onTrackClick(e, 'x');
          }
        }

        if (isWithinTrackYBounds) {
          this.axis.y.scrollbar.rect = this.axis.y.scrollbar.el.getBoundingClientRect();

          if (this.isWithinBounds(this.axis.y.scrollbar.rect)) {
            this.onDragStart(e, 'y');
          } else {
            this.onTrackClick(e, 'y');
          }
        }
      }
    }
  };

  /**
   * on scrollbar handle drag movement starts
   */
  onDragStart(e: MouseEvent, axis: Axis = 'y') {
    this.isDragging = true;
    const elDocument = getElementDocument(this.el);
    const elWindow = getElementWindow(this.el);
    const { scrollbar } = this.axis[axis];

    // Measure how far the user's mouse is from the top of the scrollbar drag handle.
    const eventOffset = axis === 'y' ? e.pageY : e.pageX;
    this.axis[axis].dragOffset = eventOffset - (scrollbar.rect?.[this.axis[axis].offsetAttr] || 0);
    this.draggedAxis = axis;

    addClasses(this.el, this.classNames.dragging);
    document.body.setAttribute('data-user-select', this.el.style.getPropertyValue('user-select'));
    document.body.style.setProperty('user-select', 'none');
    elDocument.addEventListener('mousemove', this.drag, true);
    elDocument.addEventListener('mouseup', this.onEndDrag, true);
    if (this.removePreventClickId === null) {
      elDocument.addEventListener('click', this.preventClick, true);
      elDocument.addEventListener('dblclick', this.preventClick, true);
    } else {
      elWindow.clearTimeout(this.removePreventClickId);
      this.removePreventClickId = null;
    }
  }

  /**
   * Drag scrollbar handle
   */
  drag = (e: MouseEvent) => {
    if (!this.draggedAxis || !this.wrapperEl) return;

    let eventOffset;
    const { track } = this.axis[this.draggedAxis];
    const { scrollbar } = this.axis[this.draggedAxis];

    e.preventDefault();
    e.stopPropagation();

    if (this.draggedAxis === 'y') {
      eventOffset = e.pageY;
    } else {
      eventOffset = e.pageX;
    }

    // Calculate how far the user's mouse is from the top/left of the scrollbar (minus the dragOffset).
    let dragPos =
      eventOffset -
      (track.rect?.[this.axis[this.draggedAxis].offsetAttr] ?? 0) -
      this.axis[this.draggedAxis].dragOffset;
    dragPos =
      this.draggedAxis === 'x' && this.isRtl
        ? (track.rect?.[this.axis[this.draggedAxis].sizeAttr] ?? 0) - scrollbar.size - dragPos
        : dragPos;

    const scrollPos = this.getPointerPosition(dragPos, this.draggedAxis);
    this.scrollToAxisPosition(scrollPos, this.draggedAxis);
  };

  getPointerPosition = (dragPos: number, axis: Axis) => {
    const { track } = this.axis[axis];
    const trackSize = track.rect?.[this.axis[axis].sizeAttr] ?? 0;
    const { scrollbar } = this.axis[axis];
    const contentSize = this.getWrapperElScrollSize(this.axis[axis].scrollSizeAttr) ?? 0;
    const hostSize = parseInt(this.elStyles?.[this.axis[axis].sizeAttr] ?? '0px', 10);

    // Convert the mouse position into a percentage of the scrollbar height/width.
    const dragPerc = dragPos / (trackSize - scrollbar.size);

    // Scroll the content by the same percentage.
    let scrollPos = dragPerc * (contentSize - hostSize);

    // Fix browsers inconsistency on RTL
    if (axis === 'x' && this.isRtl) {
      scrollPos = BkScrollbarCore.getRtlHelpers()?.isScrollingToNegative ? -scrollPos : scrollPos;
    }

    return scrollPos;
  };

  scrollToAxisPosition = (scrollPos: number, axisValue: Axis) => {
    const getFormatPosition = () => {
      if (scrollPos < 0) {
        return 0;
      }

      if (axisValue === 'y') {
        const diffHeight = this.getWrapperElScrollSize('scrollHeight') - this.wrapperEl.offsetHeight;
        return scrollPos >= diffHeight ? diffHeight : scrollPos;
      }

      const diffWidth = this.getWrapperElScrollSize('scrollWidth') - this.wrapperEl.offsetWidth;
      return scrollPos >= diffWidth ? diffWidth : scrollPos;
    };

    const scrollAttr = this.axis[axisValue].scrollOffsetAttr;
    const resolvedValue = getFormatPosition();
    const scrollValue = this.wrapperScrollValue[scrollAttr] ?? 0;

    if (scrollValue !== resolvedValue) {
      this.fixedScrollTo(axisValue, resolvedValue);

      return true;
    }

    return false;
  };
  fixedScrollTo = (axisValue: Axis, resolvedValue: number) => {
    const getStyleValue = (key: string) => {
      const xValue = this.axis[key].track.el.style.getPropertyValue('--scroll-offset-x');
      const yValye = this.axis[key].track.el.style.getPropertyValue('--scroll-offset-y');

      return [xValue ? xValue : '0px', yValye ? yValye : '0px'];
    };

    const scrollAttr = this.axis[axisValue].scrollOffsetAttr;
    Object.assign(this.wrapperScrollValue, { [scrollAttr]: resolvedValue });
    if (
      (this.options.useSystemScrollXBehavior && axisValue === 'x') ||
      (this.options.useSystemScrollYBehavior && axisValue === 'y')
    ) {
      this.wrapperEl[scrollAttr] = resolvedValue;

      const [verticalX, verticalY] = getStyleValue('y');
      const [horiX, horiY] = getStyleValue('x');
      const old = {
        x: {
          x: horiX,
          y: horiY,
        },
        y: {
          x: verticalX,
          y: verticalY,
        },
      };

      ['x', 'y'].forEach(key => {
        old[key][axisValue] = `${resolvedValue}px`;
        this.axis[key].track.el.style.setProperty('--scroll-offset-x', old[key].x);
        this.axis[key].track.el.style.setProperty('--scroll-offset-y', old[key].y);
      });
    }

    if (axisValue === 'y') {
      this.wheelOffsetY = resolvedValue;
    }

    if (axisValue === 'x') {
      this.wheelOffsetX = resolvedValue;
    }

    this.options?.onScrollCallback?.({
      x: this.wrapperScrollValue.scrollLeft,
      y: this.wrapperScrollValue.scrollTop,
    });

    this.positionScrollbar(axisValue);
  };

  /**
   * End scroll handle drag
   */
  onEndDrag = (e: MouseEvent) => {
    this.isDragging = false;
    const elDocument = getElementDocument(this.el);
    const elWindow = getElementWindow(this.el);
    e.preventDefault();
    e.stopPropagation();

    removeClasses(this.el, this.classNames.dragging);

    document.body.style.setProperty('user-select', this.el.getAttribute('data-user-select'));

    this.onStopScrolling();

    elDocument.removeEventListener('mousemove', this.drag, true);
    elDocument.removeEventListener('mouseup', this.onEndDrag, true);
    this.removePreventClickId = elWindow.setTimeout(() => {
      // Remove these asynchronously so we still suppress click events
      // generated simultaneously with mouseup.
      elDocument.removeEventListener('click', this.preventClick, true);
      elDocument.removeEventListener('dblclick', this.preventClick, true);
      this.removePreventClickId = null;
      removeClasses(this.axis[this.draggedAxis].track.el, this.classNames.hover);
    });
  };

  /**
   * Handler to ignore click events during drag
   */
  preventClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  onTrackClick(e: MouseEvent, axis: Axis = 'y') {
    const currentAxis = this.axis[axis];
    if (!this.options.clickOnTrack || !currentAxis.scrollbar.el || !this.wrapperEl) return;

    // Preventing the event's default to trigger click underneath
    e.preventDefault();

    const elWindow = getElementWindow(this.el);
    this.axis[axis].scrollbar.rect = currentAxis.scrollbar.el.getBoundingClientRect();
    const { scrollbar } = this.axis[axis];
    const scrollbarOffset = scrollbar.rect?.[this.axis[axis].offsetAttr] ?? 0;

    const rect = this.wrapperEl.getBoundingClientRect();

    // 获取鼠标相对于视口的位置
    const x = e.clientX;
    const y = e.clientY;

    // 计算鼠标相对于目标元素的相对位置
    const relativeX = x - rect.left;
    const relativeY = y - rect.top;

    const hostSize = axis === 'y' ? relativeY : relativeX;

    let scrolled = this.wrapperScrollMap[this.axis[axis].scrollOffsetAttr] ?? 0;
    const t = axis === 'y' ? this.mouseY - scrollbarOffset : this.mouseX - scrollbarOffset;
    const dir = t < 0 ? -1 : 1;
    let scrollSize = dir === -1 ? scrolled - hostSize : hostSize - scrolled;
    const speed = scrollSize > 40 ? 40 : scrollSize;

    const scrollTo = () => {
      if (!this.wrapperEl) return;
      if (scrollSize > 0) {
        scrolled = scrolled + dir * speed;
        scrollSize -= speed;
        const resolvedValue = this.getPointerPosition(scrolled, axis);
        this.scrollToAxisPosition(resolvedValue, axis);
        elWindow.requestAnimationFrame(scrollTo);
      }
    };

    scrollTo();
  }

  /**
   * Getter for content element
   */
  getContentElement() {
    return this.contentEl;
  }

  /**
   * Getter for original scrolling element
   */
  getScrollElement() {
    return this.wrapperEl;
  }

  removeListeners() {
    const elWindow = getElementWindow(this.el);

    this.mouseWheelInstance?.removeWheelEvent(this.el);

    // Event listeners
    this.el.removeEventListener('mouseenter', this.onMouseEnter);

    this.el.removeEventListener('pointerdown', this.onPointerEvent, true);

    this.el.removeEventListener('mousemove', this.onMouseMove);
    this.el.removeEventListener('mouseleave', this.onMouseLeave);

    if (this.wrapperEl) {
      this.wrapperEl.removeEventListener('scroll', this.onScroll);
    }

    elWindow.removeEventListener('resize', this.onWindowResize);

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    // Cancel all debounced functions
    (this.onMouseMove as DebouncedFunc<(...args) => void>).cancel();
    (this.onWindowResize as DebouncedFunc<(...args) => void>).cancel();
    (this.onStopScrolling as DebouncedFunc<(...args) => void>).cancel();
    (this.onMouseEntered as DebouncedFunc<(...args) => void>).cancel();
  }

  /**
   * Remove all listeners from DOM nodes
   */
  unMount() {
    this.removeListeners();
  }

  /**
   * Check if mouse is within bounds
   */
  isWithinBounds(bbox: DOMRect) {
    return (
      this.mouseX >= bbox.left &&
      this.mouseX <= bbox.left + bbox.width &&
      this.mouseY >= bbox.top &&
      this.mouseY <= bbox.top + bbox.height
    );
  }

  /**
   * Find element children matches query
   */
  findChild(el: HTMLElement, query: string) {
    // @ts-ignore
    const matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    return Array.prototype.filter.call(el.children, child => matches.call(child, query))[0];
  }

  private mOnMouseWheel = args => {
    const nextY = this.wheelOffsetY + args.y;
    const nextX = this.wheelOffsetX + args.x;

    if (this.scrollToAxisPosition(nextY, 'y') || this.scrollToAxisPosition(nextX, 'x')) {
      args.evt.stopPropagation();
      args.evt.preventDefault();
      args.evt.stopImmediatePropagation();

      this.showScrollbar('y');
      this.showScrollbar('x');

      if (this.mouseWeelTimer) {
        clearTimeout(this.mouseWeelTimer);
        this.mouseWeelTimer = null;
      }

      this.mouseWeelTimer = setTimeout(() => {
        this.hideScrollbar('y');
        this.hideScrollbar('x');
      }, 200);
    }
  };

  private mOnStopScrolling = () => {
    removeClasses(this.el, this.classNames.scrolling);
    if (this.options.autoHide) {
      this.hideScrollbar('x');
      this.hideScrollbar('y');
    }
    this.isScrolling = false;
  };

  private mOnMouseEntered = () => {
    removeClasses(this.el, this.classNames.mouseEntered);
    if (this.options.autoHide) {
      this.hideScrollbar('x');
      this.hideScrollbar('y');
    }
    this.isMouseEntering = false;
  };

  private mOnMouseMove = (e: MouseEvent) => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    if (this.axis.x.isOverflowing || this.axis.x.forceVisible) {
      this.onMouseMoveForAxis('x');
    }

    if (this.axis.y.isOverflowing || this.axis.y.forceVisible) {
      this.onMouseMoveForAxis('y');
    }
  };

  private mOnWindowResize = () => {
    // Recalculate scrollbarWidth in case it's a zoom
    this.scrollbarWidth = this.getScrollbarWidth();
  };
}
