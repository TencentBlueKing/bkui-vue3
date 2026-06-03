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

import type { Placement } from '@floating-ui/vue';
import type { CSSProperties, Ref, VNode } from 'vue';

/**
 * 触发方式类型
 */
export type TriggerType = 'click' | 'hover' | 'manual';

/**
 * 渲染指令类型
 */
export type RenderDirectiveType = 'if' | 'show';

/**
 * 内容渲染方式
 */
export type RenderType = 'auto' | 'shown';

/**
 * 主题类型
 */
export type ThemeType = 'dark' | 'light' | string;

/**
 * 偏移量配置
 */
export interface IAxesOffsets {
  mainAxis?: number;
  crossAxis?: number;
  alignmentAxis?: null | number;
}

/**
 * 虚拟元素类型（用于 @floating-ui/vue）
 * 只需要提供 getBoundingClientRect 方法
 */
export interface VirtualElement {
  getBoundingClientRect: () =>
    | {
        width: number;
        height: number;
        x: number;
        y: number;
        top: number;
        left: number;
        right: number;
        bottom: number;
      }
    | DOMRect;
  contextElement?: Element;
}

/**
 * 弹出内容类型
 */
export type PopoverContent = HTMLElement | VNode | number | string;

/**
 * 目标元素类型
 */
export type PopoverTarget = HTMLElement | PointerEvent | null | string;

/**
 * 边界元素类型
 */
export type PopoverBoundary = HTMLElement | string;

/**
 * 延迟配置类型
 */
export type PopoverDelay = number | number[];

/**
 * Popover 位置类型
 */
export type PopoverPlacement = Placement;

/**
 * Popover 事件参数
 */
export interface PopoverShowHidePayload {
  isShow: boolean;
}

export interface PopoverClickOutsidePayload {
  isShow: boolean;
  event: MouseEvent;
}

/**
 * Popover 事件定义
 */
export interface PopoverEmits {
  (e: 'afterHidden' | 'afterShow', payload: PopoverShowHidePayload): void;
  (e: 'clickoutside', payload: PopoverClickOutsidePayload): void;
  (e: 'contentMouseenter' | 'contentMouseleave', event: MouseEvent): void;
  (e: 'update:isShow', value: boolean): void;
}

/**
 * Popover 暴露的公共方法
 */
export interface PopoverExpose {
  /** 显示弹出层 */
  show: () => void;
  /** 隐藏弹出层 */
  hide: () => void;
  /** 更新弹出层位置 */
  updatePopover: () => void;
  /** 重置弹出层 */
  resetPopover: () => void;
  /** 停止隐藏（取消延时） */
  stopHide: () => void;
  /** 当前是否显示 */
  isOpen: Ref<boolean>;
}

/**
 * useDelay composable 返回值
 */
export interface UseDelayReturn {
  isOpen: Ref<boolean>;
  show: () => void;
  hide: () => void;
  toggle: () => void;
  stopHide: () => void;
  clearTimers: () => void;
}

/**
 * useTrigger composable 配置
 */
export interface UseTriggerOptions {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  stopHide: () => void;
}

/**
 * useTrigger composable 返回值
 */
export interface UseTriggerReturn {
  referenceListeners: Record<string, (e: Event) => void>;
  floatingListeners: Record<string, (e: Event) => void>;
}

/**
 * useFloating composable 返回值
 */
export interface UseFloatingReturn {
  floatingStyles: Ref<CSSProperties>;
  arrowStyles: Ref<CSSProperties>;
  placement: Ref<Placement>;
  update: () => void;
  isPositioned: Ref<boolean>;
}

/**
 * $bkPopover 命令式调用选项
 */
export interface PopoverPluginOptions {
  /** 目标元素（必填） */
  target: HTMLElement | MouseEvent;
  /** 弹出内容 */
  content?: PopoverContent;
  /** 位置 */
  placement?: PopoverPlacement;
  /** 触发方式，命令式默认 manual */
  trigger?: TriggerType;
  /** 边界元素 */
  boundary?: PopoverBoundary;
  /** 是否立即创建实例 */
  immediate?: boolean;
  /** 主题 */
  theme?: ThemeType;
  /** 是否显示箭头 */
  arrow?: boolean;
  /** 偏移量 */
  offset?: IAxesOffsets | number;
  /** z-index */
  zIndex?: number;
  /** 延迟配置 */
  popoverDelay?: PopoverDelay;
  /** 自定义类名 */
  extCls?: string;
  /** 滚动超出可视范围时自动隐藏 */
  autoVisibility?: boolean;
  /** 允许 HTML 内容 */
  allowHtml?: boolean;
  /** 宽度 */
  width?: number | string;
  /** 高度 */
  height?: number | string;
  /** 最大宽度 */
  maxWidth?: number | string;
  /** 最大高度 */
  maxHeight?: number | string;
  /** 显示回调 */
  onShow?: () => void;
  /** 隐藏回调 */
  onHide?: () => void;
  /** 内容区鼠标移入回调 */
  onContentMouseenter?: () => void;
  /** 内容区鼠标移出回调 */
  onContentMouseleave?: () => void;
}

/**
 * $bkPopover 返回的实例方法
 */
export interface PopoverPluginInstance {
  /** 显示弹出层 */
  show: (target?: HTMLElement | MouseEvent) => void;
  /** 隐藏弹出层 */
  hide: () => void;
  /** 更新目标位置 */
  update: (event: MouseEvent) => void;
  /** 关闭并销毁实例 */
  close: () => void;
  /** 安装实例 */
  install: () => void;
  /** 卸载实例 */
  uninstall: () => void;
  /** Vue 实例 */
  readonly vm: unknown;
  /** DOM 元素 */
  readonly $el: HTMLElement;
}

/**
 * 箭头位置信息
 */
export interface ArrowData {
  x?: number;
  y?: number;
  centerOffset?: number;
}

/**
 * 内部使用的状态
 */
export interface PopoverState {
  isOpen: boolean;
  isPositioned: boolean;
  placement: Placement;
}
