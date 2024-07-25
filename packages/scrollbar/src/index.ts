/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
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

import clickRail from './handlers/click-rail';
import dragThumb from './handlers/drag-thumb';
import keyboard from './handlers/keyboard';
import wheel from './handlers/mouse-wheel';
import touch from './handlers/touch';
import Cls from './helper/class-names';
import * as CSS from './helper/css';
import * as DOM from './helper/dom';
import EventManager from './helper/event-manager';
import { toInt, outerWidth } from './helper/util';
import processScrollDiff from './process-scroll-diff';
import updateGeometry from './update-geometry';

export enum IScrollbarSize {
  Large = 'large',
  Normal = 'normal',
  Small = 'small',
}

// 默认配置
const defaultSettings = () => ({
  handlers: ['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch'],
  maxScrollbarLength: null,
  minScrollbarLength: 16,
  scrollingThreshold: 1000,
  scrollXMarginOffset: 0,
  scrollYMarginOffset: 0,
  suppressScrollX: false,
  suppressScrollY: false,
  swipeEasing: true,
  useBothWheelAxes: false,
  wheelPropagation: true,
  wheelSpeed: 1,
  classPrefix: 'bk',
  scrollSize: IScrollbarSize.Normal,
});

// 处理器集合
const handlers = {
  'click-rail': clickRail,
  'drag-thumb': dragThumb,
  keyboard,
  wheel,
  touch,
};

/**
 * 滚动条配置项类型定义
 * @property {string[]} handlers - 需要启用的处理器名称列表
 * @property {number | null} maxScrollbarLength - 滚动条的最大长度，单位像素
 * @property {number | null} minScrollbarLength - 滚动条的最小长度，单位像素
 * @property {number} scrollingThreshold - 滚动事件的节流时间，单位毫秒
 * @property {number} scrollXMarginOffset - 水平滚动条的边距偏移量，单位像素
 * @property {number} scrollYMarginOffset - 垂直滚动条的边距偏移量，单位像素
 * @property {boolean} suppressScrollX - 是否禁用水平滚动条
 * @property {boolean} suppressScrollY - 是否禁用垂直滚动条
 * @property {boolean} swipeEasing - 是否启用触控滑动时的缓动效果
 * @property {boolean} useBothWheelAxes - 是否在滚动时同时滚动两个轴
 * @property {boolean} wheelPropagation - 是否启用滚轮事件传播
 * @property {number} wheelSpeed - 滚轮滚动速度
 */
export type ISettingPropType = {
  handlers: string[];
  maxScrollbarLength: null | number;
  minScrollbarLength: null | number;
  scrollingThreshold: number;
  scrollXMarginOffset: number;
  scrollYMarginOffset: number;
  suppressScrollX: boolean;
  suppressScrollY: boolean;
  swipeEasing: boolean;
  useBothWheelAxes: boolean;
  wheelPropagation: boolean;
  wheelSpeed: number;
  onScollCallback?: (...args) => void;
  classPrefix?: string;
  scrollSize: IScrollbarSize;
};

export type VirtualElementOptions = {
  scrollHeight: number;
  scrollTop?: number;
  scrollLeft?: number;
  className: string;
  delegateElement: HTMLElement;
  onScollCallback: (...args) => void;
};

export class VirtualElement {
  isVirtualElement = true;
  scrollHeight: number;
  virtualScrollTop: number;
  virtualScrollLeft: number;
  scrollTop = 0;
  onScollCallback: (...args) => void;

  delegateElement: HTMLElement;
  constructor({ scrollHeight, delegateElement, onScollCallback }: Partial<VirtualElementOptions>) {
    this.scrollHeight = scrollHeight;
    this.delegateElement = delegateElement;
    this.virtualScrollTop = 0;
    this.virtualScrollLeft = 0;
    this.onScollCallback = onScollCallback;

    return new Proxy(this, {
      get: (target, prop, receiver) => {
        if (prop in target) {
          const value = Reflect.get(target, prop, receiver);
          if (value !== undefined) {
            return value;
          }
        }
        if (delegateElement && prop in delegateElement) {
          const value = delegateElement[prop as keyof Element];
          // Bind the method to delegateElement if it's a function
          if (typeof value === 'function') {
            return value.bind(delegateElement);
          }
          return value;
        }
        return undefined;
      },
      set: (target, prop, value) => {
        if (prop in target) {
          if (prop === 'scrollTop') {
            target.virtualScrollTop = (value * target.delegateElement.offsetHeight) / target.scrollHeight;
            const triggerCallbackFn = target.scrollTop !== value;
            target.scrollTop = value;

            if (triggerCallbackFn) {
              this.handleScrollChanged('scrollTop');
            }
            return true;
          }

          target[prop] = value;
          return true;
        }

        if (delegateElement && prop in delegateElement) {
          delegateElement[prop] = value;
          this.handleScrollChanged(prop as string);
          return true;
        }

        target[prop] = value;
        return true;
      },
    });
  }

  handleScrollChanged(prop: string) {
    if (['scrollLeft', 'scrollTop'].includes(prop)) {
      const args = { offset: { x: this.delegateElement.scrollLeft, y: this.scrollTop } };
      this.onScollCallback?.(args);
    }
  }

  scrollTo({ x, y }) {
    this.delegateElement.scrollLeft = x;
    this.scrollTop = y;
    this.delegateElement.scrollTo(x, y);
  }
}

// 自定义滚动条类
export default class BkScrollbar {
  element: Partial<HTMLElement> | Partial<VirtualElement>;
  containerWidth: number;
  containerHeight: number;
  contentWidth: number;
  settings: ISettingPropType;
  contentHeight: number;
  isRtl: boolean;
  isNegativeScroll: boolean;
  negativeScrollAdjustment: number;
  event: EventManager;
  ownerDocument: Document;
  scrollbarXRail: HTMLDivElement;
  scrollbarX: HTMLDivElement;
  scrollbarXActive: boolean;
  scrollbarXWidth: number;
  scrollbarXLeft: number;
  scrollbarXBottom: number;
  isScrollbarXUsingBottom: boolean;
  scrollbarXTop: number;
  railBorderXWidth: number;
  railXMarginWidth: number;
  railXWidth: number;
  railXRatio: number;
  scrollbarYRail: HTMLDivElement;
  scrollbarY: HTMLDivElement;
  scrollbarYActive: boolean;
  scrollbarYHeight: number;
  scrollbarYTop: number;
  scrollbarYRight: number;
  isScrollbarYUsingRight: boolean;
  scrollbarYLeft: number;
  scrollbarYOuterWidth: number;
  railBorderYWidth: number;
  railYMarginHeight: number;
  railYHeight: number;
  railYRatio: number;
  reach: { x: string; y: string };
  isAlive: boolean;
  lastScrollTop: number;
  lastScrollLeft: number;
  cls: Cls;

  /**
   * 构造函数
   * @param {Element | string} element - 滚动条元素或选择器字符串
   * @param {Partial<ISettingPropType>} userSettings - 用户配置
   */
  constructor(
    element: (Partial<Element> | Partial<VirtualElement>) | string,
    userSettings: Partial<ISettingPropType> = {},
  ) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }

    if (!(element as HTMLElement)?.nodeName && !(element as VirtualElement)?.isVirtualElement) {
      throw new Error('no element is specified to initialize PerfectScrollbar');
    }

    this.settings = { ...defaultSettings(), ...userSettings };

    this.element = element as Partial<Element> | Partial<VirtualElement>;
    this.cls = new Cls(this.settings.classPrefix);
    (element as HTMLElement).classList.add(this.cls.main);

    this.containerWidth = null;
    this.containerHeight = null;
    this.contentWidth = null;
    this.contentHeight = null;

    const focus = () => (element as HTMLElement).classList.add(this.cls.state.focus);
    const blur = () => (element as HTMLElement).classList.remove(this.cls.state.focus);

    this.isRtl = CSS.get(element).direction === 'rtl';
    if (this.isRtl) {
      (element as HTMLElement).classList.add(this.cls.rtl);
    }

    this.isNegativeScroll = (() => {
      const originalScrollLeft = (element as HTMLElement).scrollLeft;
      let result = null;
      (element as HTMLElement).scrollLeft = -1;
      result = (element as HTMLElement).scrollLeft < 0;
      (element as HTMLElement).scrollLeft = originalScrollLeft;
      return result;
    })();

    this.negativeScrollAdjustment = this.isNegativeScroll
      ? (element as HTMLElement).scrollWidth - (element as HTMLElement).clientWidth
      : 0;
    this.event = new EventManager();
    this.ownerDocument = (element as HTMLElement).ownerDocument || document;

    this.scrollbarXRail = DOM.div(this.cls.element.rail('x'));
    this.scrollbarXRail.classList.add(this.cls.element.size(this.settings.scrollSize));
    (element as HTMLElement).appendChild(this.scrollbarXRail);
    this.scrollbarX = DOM.div(this.cls.element.thumb('x'));
    this.scrollbarXRail.appendChild(this.scrollbarX);
    this.scrollbarX.setAttribute('tabindex', '0');
    this.event.bind(this.scrollbarX, 'focus', focus);
    this.event.bind(this.scrollbarX, 'blur', blur);
    this.scrollbarXActive = null;
    this.scrollbarXWidth = null;
    this.scrollbarXLeft = null;

    const railXStyle = CSS.get(this.scrollbarXRail);
    this.scrollbarXBottom = parseInt(railXStyle.bottom, 10);
    if (isNaN(this.scrollbarXBottom)) {
      this.isScrollbarXUsingBottom = false;
      this.scrollbarXTop = toInt(railXStyle.top);
    } else {
      this.isScrollbarXUsingBottom = true;
    }

    this.railBorderXWidth = toInt(railXStyle.borderLeftWidth) + toInt(railXStyle.borderRightWidth);
    CSS.set(this.scrollbarXRail, { display: 'block' });
    this.railXMarginWidth = toInt(railXStyle.marginLeft) + toInt(railXStyle.marginRight);
    CSS.set(this.scrollbarXRail, { display: '' });
    this.railXWidth = null;
    this.railXRatio = null;

    this.scrollbarYRail = DOM.div(this.cls.element.rail('y'));
    this.scrollbarYRail.classList.add(this.cls.element.size(this.settings.scrollSize));
    (element as HTMLElement).appendChild(this.scrollbarYRail);
    this.scrollbarY = DOM.div(this.cls.element.thumb('y'));
    this.scrollbarYRail.appendChild(this.scrollbarY);
    this.scrollbarY.setAttribute('tabindex', '0');
    this.event.bind(this.scrollbarY, 'focus', focus);
    this.event.bind(this.scrollbarY, 'blur', blur);
    this.scrollbarYActive = null;
    this.scrollbarYHeight = null;
    this.scrollbarYTop = null;

    const railYStyle = CSS.get(this.scrollbarYRail);
    this.scrollbarYRight = parseInt(railYStyle.right, 10);
    if (isNaN(this.scrollbarYRight)) {
      this.isScrollbarYUsingRight = false;
      this.scrollbarYLeft = toInt(railYStyle.left);
    } else {
      this.isScrollbarYUsingRight = true;
    }

    this.scrollbarYOuterWidth = this.isRtl ? outerWidth(this.scrollbarY) : null;
    this.railBorderYWidth = toInt(railYStyle.borderTopWidth) + toInt(railYStyle.borderBottomWidth);
    CSS.set(this.scrollbarYRail, { display: 'block' });
    this.railYMarginHeight = toInt(railYStyle.marginTop) + toInt(railYStyle.marginBottom);
    CSS.set(this.scrollbarYRail, { display: '' });
    this.railYHeight = null;
    this.railYRatio = null;

    this.reach = {
      x:
        (element as HTMLElement).scrollLeft <= 0
          ? 'start'
          : (element as HTMLElement).scrollLeft >= (this.contentWidth ?? 0) - this.containerWidth
            ? 'end'
            : null,
      y:
        element.scrollTop <= 0
          ? 'start'
          : element.scrollTop >= (this.contentHeight ?? 0) - this.containerHeight
            ? 'end'
            : null,
    };

    this.isAlive = true;

    this.settings.handlers.forEach(handlerName => handlers[handlerName](this));

    this.lastScrollTop = Math.floor(element.scrollTop);
    this.lastScrollLeft = (element as HTMLElement).scrollLeft;
    this.event.bind(this.element, 'scroll', e => this.onScroll(e));
    updateGeometry(this);
  }

  /**
   * 更新滚动条
   */
  update(virtaulElement?: VirtualElement) {
    if (!this.isAlive) {
      return;
    }

    if (virtaulElement?.isVirtualElement) {
      this.element = virtaulElement;
    }

    this.negativeScrollAdjustment = this.isNegativeScroll
      ? (this.element as HTMLElement).scrollWidth - (this.element as HTMLElement).clientWidth
      : 0;

    CSS.set(this.scrollbarXRail, { display: 'block' });
    CSS.set(this.scrollbarYRail, { display: 'block' });
    this.railXMarginWidth =
      toInt(CSS.get(this.scrollbarXRail).marginLeft) + toInt(CSS.get(this.scrollbarXRail).marginRight);
    this.railYMarginHeight =
      toInt(CSS.get(this.scrollbarYRail).marginTop) + toInt(CSS.get(this.scrollbarYRail).marginBottom);

    CSS.set(this.scrollbarXRail, { display: 'none' });
    CSS.set(this.scrollbarYRail, { display: 'none' });

    updateGeometry(this);

    processScrollDiff(this, 'top', 0, false, true);
    processScrollDiff(this, 'left', 0, false, true);

    CSS.set(this.scrollbarXRail, { display: '' });
    CSS.set(this.scrollbarYRail, { display: '' });
  }

  /**
   * 滚动事件处理
   * @param {Event} _e - 滚动事件
   */
  onScroll(_e) {
    if (!this.isAlive) {
      return;
    }

    updateGeometry(this);
    processScrollDiff(this, 'top', this.element.scrollTop - this.lastScrollTop);
    processScrollDiff(this, 'left', (this.element as HTMLElement).scrollLeft - this.lastScrollLeft);

    this.lastScrollTop = Math.floor(this.element.scrollTop);
    this.lastScrollLeft = (this.element as HTMLElement).scrollLeft;
  }

  scrollTo({ x, y }) {
    this.element.scrollTop = y;
    (this.element as HTMLElement).scrollLeft = x;
    updateGeometry(this);
  }

  /**
   * 销毁滚动条实例
   */
  destroy() {
    if (!this.isAlive) {
      return;
    }

    this.event.unbindAll();
    DOM.remove(this.scrollbarX);
    DOM.remove(this.scrollbarY);
    DOM.remove(this.scrollbarXRail);
    DOM.remove(this.scrollbarYRail);
    this.removePsClasses();

    this.element = null;
    this.scrollbarX = null;
    this.scrollbarY = null;
    this.scrollbarXRail = null;
    this.scrollbarYRail = null;

    this.isAlive = false;
  }

  /**
   * 移除滚动条相关的类名
   */
  removePsClasses() {
    (this.element as HTMLElement).className = (this.element as HTMLElement).className
      .split(' ')
      .filter(name => !name.match(new RegExp(`^${this.settings.classPrefix}([-_].+|)$`)))
      .join(' ');
  }
}
