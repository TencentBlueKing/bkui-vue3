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

import {
  createPopper,
  Instance,
  Modifier,
  Placement,
  PositioningStrategy,
  State,
  VirtualElement,
} from '@popperjs/core';

import { isElement, merge } from './helper';

export type OnFirstUpdateFnType = (instance: Partial<State>) => void;
export declare type IOptions = {
  placement?: Placement;
  modifiers?: Array<Partial<Modifier<any, any>>>;
  strategy?: PositioningStrategy;
  onFirstUpdate?: OnFirstUpdateFnType;
  isShow?: boolean;
  always?: boolean;
  theme?: string;
  trigger?: string;
  disabled?: boolean;
  appendTo?: string | HTMLElement;
  afterShow?: () => void;
  afterHidden?: () => void;
  /**
   * 如果设置了appendTo为指定DOM，此配置项生效
   * 是否将弹出内容固定到目标元素位置
   * 例如：appendTo = document.body, fixOnBoundary = true，则弹出内容会一直固定到body
   */
  fixOnBoundary?: Boolean
};

export declare type IBKPopover = Instance & {
  show: () => void;
  hide: () => void;
  updateDisabled: (val: boolean) => void;
  isShow: boolean;
};

export class BKPopover {
  /** 当前提内容是否弹出 */
  public isShow = false;

  /** 触发条件 */
  public trigger?: string = undefined;

  /** 当前popperjs实例 */
  private instance?: Instance = undefined;

  /** 是否总是可见 */
  private always?: boolean = false;

  /** Popover 外层容器，触发Pop的元素 */
  private reference?: HTMLElement | VirtualElement | null = undefined;

  /** Popover 弹出内容外层占位容器 */
  private referenceTarget?: HTMLElement | VirtualElement | null = undefined;

  /** Popover Content 外层容器，目标元素：实际弹出内容 */
  private popperRefer?: HTMLElement | null = undefined;

  /** 默认初始化配置项 */
  private instanceOptions: IOptions;

  /** hide延时 */
  private delay = 50;

  /** 是否进入popperRefer */
  private isInnerPopper = false;

  /** 是否为禁用状态 */
  private disabled = false;

  /** 执行显示函数 */
  private afterShow: void | any = null;

  /** 执行隐藏函数 */
  private afterHidden: void | any = null;

  /** 弹出内容AppendTo */
  private appendTo: string | HTMLElement = 'parent';

  /** 父级容器 */
  private container?: HTMLElement = null;

  /**
   * 如果设置了appendTo为指定DOM，此配置项生效
   * 是否将弹出内容固定到目标元素位置
   * 例如：appendTo = document.body, fixOnBoundary = true，则弹出内容会一直固定到body
   */
  private fixOnBoundary: Boolean = false;

  constructor(reference?: string | HTMLElement, popperRefer?: string | HTMLElement, options?: IOptions) {
    this.instanceOptions = this.initDefaultOptions(options);
    this.reference = this.resolveInputSelectorToHtmlElement(reference);
    this.popperRefer = this.resolveInputSelectorToHtmlElement(popperRefer);
    this.referenceTarget = this.getTargetReferenceElement();
    this.container = this.popperRefer?.parentElement;
    this.isShow = !!this.instanceOptions?.isShow;
    this.always = this.instanceOptions.always;
    this.trigger = this.instanceOptions.trigger;
    this.disabled = this.instanceOptions.disabled;
    this.appendTo = this.instanceOptions.appendTo;
    this.afterHidden = typeof options.afterHidden === 'function' ? options.afterHidden : () => {};
    this.afterShow = typeof options.afterShow === 'function' ? options.afterShow : () => {};
    this.fixOnBoundary = this.instanceOptions.fixOnBoundary;
    this.initInstance();
    this.registerEvents();

    /** 默认弹出 */
    if (this.isShow || this.always) {
      this.show(null);
    }
  }

  // Synchronously updates the popper instance. Use this for low-frequency
  // updates.
  public forceUpdate() {
    this.instance?.forceUpdate();
  }

  // Asynchronously updates the popper instance, and returns a promise. Use this
  // for high-frequency updates.
  public update() {
    this.instance?.update();
  }

  public updateOptions(options: IOptions) {
    this.instanceOptions = this.initDefaultOptions(options);
    this.isShow = !!this.instanceOptions?.isShow;
    this.trigger = this.instanceOptions.trigger;
    this.disabled = this.instanceOptions.disabled;
    this.setOptions(this.instanceOptions);
  }

  // Updates the options of the instance.
  public setOptions(options: IOptions) {
    this.instance?.setOptions(options);
  }

  // Cleans up the instance.
  public destroy() {
    this.instance?.destroy();
  }

  // 更新禁用状态
  public updateDisabled(disabled?: boolean) {
    this.disabled = disabled ?? !this.disabled;
    this.disabled && this.hide();
  }

  /**
   * 展示Pop
   * @param _event 触发事件
   */
  public show(_event: any) {
    if (!this.disabled) {
      // Make the tooltip visible
      this.popperRefer?.setAttribute('data-show', '');

      // Enable the event listeners
      this.setOptions({
        modifiers: [...(this.instanceOptions.modifiers || []), { name: 'eventListeners', enabled: true }],
      });

      // Update its position
      this.update();

      this.isShow = true;

      this.afterShow();

      if (!this.fixOnBoundary) {
        this.appendToTarget();
      }
    }
  }

  /**
   * 隐藏
   * @param event 触发事件
   */
  public hide() {
    if (this.always) return;
    // Hide the tooltip
    this.popperRefer?.removeAttribute('data-show');

    // Disable the event listeners
    this.setOptions({
      modifiers: [...(this.instanceOptions.modifiers || []), { name: 'eventListeners', enabled: false }],
    });

    this.isShow = false;
    this.isInnerPopper = false;
    this.afterHidden();

    if (!this.fixOnBoundary) {
      this.restorePopContent();
    }
  }

  /**
   * 还原PopContent到初试位置
   */
  private restorePopContent() {
    const target = this.getAppendToTarget();
    if (isElement(target)
        && (target as HTMLElement).contains(this.popperRefer)
        && this.container
        && !this.container.contains(this.popperRefer)) {
      this.container.append(this.popperRefer);
    }
  }

  /**
   * 挂载PopContent到目标位置
   */
  private appendToTarget() {
    const target = this.getAppendToTarget();
    if (isElement(target) && (target as HTMLElement).contains(this.popperRefer)) {
      (target as HTMLElement).append(this.popperRefer);
    }
  }

  /**
   * 获取目标位置元素
   * @returns
   */
  private getAppendToTarget() {
    const  { appendTo } = this;
    let target: string | HTMLElement = appendTo;
    if (appendTo !== 'parent') {
      if (typeof appendTo === 'string') {
        target = document.querySelector(appendTo) as HTMLElement;
      }
    }

    return target;
  }

  /**
   * 初始化默认配置
   * @param opts
   * @returns
   */
  private initDefaultOptions(opts?: IOptions) {
    const defaultCfg = {
      placement: 'top',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
      strategy: 'absolute',
      onFirstUpdate: undefined,
      isShow: false,
      theme: 'dark',
      trigger: 'hover',
      disabled: false,
    };

    const targetOptions = merge(defaultCfg, opts || {});
    const sourceOnFirstUpdate = targetOptions.onFirstUpdate;
    targetOptions.onFirstUpdate = (state: State) => {
      if (typeof sourceOnFirstUpdate === 'function') {
        sourceOnFirstUpdate.call(this, state);
        this.handleFirstUpdate();
      }
    };
    return targetOptions;
  }

  /**
 * 判定是否需要将PopContent挂载到目标元素
 */
  private handleFirstUpdate() {
    if (this.fixOnBoundary) {
      this.appendToTarget();
    }
  }

  /**
   * 剔除 Pop 外层容器，获取目标元素
   * @returns
   */
  private getTargetReferenceElement() {
    if (this.isElement(this.reference)) {
      return (this.reference as HTMLElement).childElementCount === 1
        ? (this.reference as HTMLElement).firstElementChild
        : this.reference;
    }

    return this.reference;
  }

  /**
   * 初始化Pop Instance
   */
  private initInstance() {
    if (this.referenceTarget) {
      if (this.referenceTarget && this.popperRefer) {
        this.instance = createPopper(
          this.referenceTarget as HTMLElement,
          this.popperRefer as HTMLElement,
          this.instanceOptions,
        );

        this.popperRefer?.setAttribute('data-theme', this.instanceOptions.theme ?? 'dark');
      } else {
        console.error('reference or popperRefer is null, please check html element.');
      }
    }
  }

  /**
   * 解析当前参数为对应的Html Element
   * @param refer Html Element Selector Or Html Element
   * @param checkVirtualDom 是否检查虚拟DOM
   * @returns Html Element Or Null
   */
  private resolveInputSelectorToHtmlElement(refer?: string | HTMLElement) {
    if (this.isElement(refer)) {
      return refer as HTMLElement;
    }

    if (typeof refer === 'string') {
      return document.querySelector(refer) as HTMLElement;
    }

    if (typeof refer === 'object') {
      if (Object.prototype.hasOwnProperty.call(refer, 'getBoundingClientRect')) {
        return refer;
      }
    } else {
      console.error('\'getBoundingClientRect\' is needed when use virtual elements');
    }

    return null;
  }

  /**
   * 检查当前元素是否为Html元素
   * @param obj
   * @returns
   */
  private isElement(obj: any) {
    return isElement(obj);
  }

  private registerEvents() {
    if (this.isElement(this.referenceTarget)) {
      if (this.trigger === 'hover') {
        const showEvents = ['mouseenter', 'focus'];
        const hideEvents = ['mouseleave', 'blur'];
        const contentEvents = ['mouseenter', 'mouseleave'];
        showEvents.forEach((event) => {
          (this.referenceTarget as HTMLElement).addEventListener(event, (evt) => {
            if (event === 'mouseenter') this.isInnerPopper = true;
            this.show(evt);
          });
        });

        hideEvents.forEach((event) => {
          (this.referenceTarget as HTMLElement).addEventListener(event, () => {
            this.isInnerPopper = false;
            setTimeout(() => {
              !this.isInnerPopper && this.hide();
            }, this.delay);
          });
        });

        if (this.isElement(this.popperRefer)) {
          contentEvents.forEach((event) => {
            (this.popperRefer as HTMLElement).addEventListener(event, () => {
              if (event === 'mouseenter') this.isInnerPopper = true;
              if (event === 'mouseleave') this.hide();
            });
          });
        }
      }
    }

    if (this.trigger === 'click') {
      const showEvents = ['click'];
      showEvents.forEach((event) => {
        (document.body as HTMLElement).addEventListener(event, (event) => {
          if (
            this.isSameElement(event.target as HTMLElement, this.reference)
            || (this.reference as HTMLElement).contains(event.target as HTMLElement)
          ) {
            this.show(event);
          } else {
            if (this.isShow && !this.isSameElement(event.target as HTMLElement, this.popperRefer)) {
              this.hide();
            }
          }
        });
      });
    }
  }

  private isSameElement(source: HTMLElement | null, target: any) {
    return source && (source === target || source === target.firstElementChild);
  }
}
