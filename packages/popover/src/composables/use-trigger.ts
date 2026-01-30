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

import { computed, type Ref, type ComputedRef } from 'vue';

import type { TriggerType } from '../types';

export interface UseTriggerOptions {
  /** 显示弹出层 */
  show: () => void;
  /** 隐藏弹出层 */
  hide: () => void;
  /** 切换显示状态 */
  toggle: () => void;
  /** 停止隐藏 */
  stopHide: () => void;
  /** 触发内容区鼠标移入事件 */
  emitContentMouseenter?: (e: MouseEvent) => void;
  /** 触发内容区鼠标移出事件 */
  emitContentMouseleave?: (e: MouseEvent) => void;
}

export interface UseTriggerProps {
  trigger: TriggerType;
  disabled: boolean;
  /** 是否始终显示 */
  always?: boolean;
  /** 点击 Reference 时是否忽略收起 */
  hideIgnoreReference?: boolean;
  /** 当前是否显示 */
  isOpen?: boolean;
}

export interface UseTriggerReturn {
  /** Reference 元素的事件监听器 */
  referenceListeners: ComputedRef<Record<string, (e: Event) => void>>;
  /** Floating 元素（弹出内容）的事件监听器 */
  floatingListeners: ComputedRef<Record<string, (e: Event) => void>>;
}

/**
 * 管理 Popover 的触发事件
 *
 * 根据 trigger 类型返回不同的事件监听器：
 * - hover: mouseenter/mouseleave/focus/blur
 * - click: click
 * - manual: 无事件（通过 isShow prop 控制）
 */
export function useTrigger(
  props: Ref<UseTriggerProps>,
  options: UseTriggerOptions,
): UseTriggerReturn {
  const { show, hide, toggle, stopHide, emitContentMouseenter, emitContentMouseleave } = options;

  /**
   * Reference 元素的事件监听器
   */
  const referenceListeners = computed(() => {
    if (props.value.disabled) {
      return {};
    }

    switch (props.value.trigger) {
      case 'hover':
        return {
          onMouseenter: () => show(),
          onMouseleave: () => hide(),
          onFocus: () => show(),
          onBlur: () => hide(),
        };
      case 'click':
        return {
          onClick: (e: Event) => {
            e.stopPropagation();
            // 如果 always 为 true，不执行任何操作
            if (props.value.always) {
              return;
            }
            // 如果 hideIgnoreReference 为 true 且当前已显示，不执行隐藏
            if (props.value.hideIgnoreReference && props.value.isOpen) {
              return;
            }
            toggle();
          },
        };
      case 'manual':
      default:
        return {};
    }
  });

  /**
   * Floating 元素（弹出内容）的事件监听器
   */
  const floatingListeners = computed(() => {
    if (props.value.disabled) {
      return {};
    }

    // hover 模式：鼠标移入内容区时停止隐藏，移出时隐藏
    if (props.value.trigger === 'hover') {
      return {
        onMouseenter: (e: Event) => {
          stopHide();
          emitContentMouseenter?.(e as MouseEvent);
        },
        onMouseleave: (e: Event) => {
          // always 模式下不隐藏
          if (!props.value.always) {
            hide();
          }
          emitContentMouseleave?.(e as MouseEvent);
        },
      };
    }

    // manual 模式：仅触发事件，不控制显示/隐藏
    if (props.value.trigger === 'manual') {
      return {
        onMouseenter: (e: Event) => {
          emitContentMouseenter?.(e as MouseEvent);
        },
        onMouseleave: (e: Event) => {
          emitContentMouseleave?.(e as MouseEvent);
        },
      };
    }

    // click 模式：触发事件
    return {
      onMouseenter: (e: Event) => {
        emitContentMouseenter?.(e as MouseEvent);
      },
      onMouseleave: (e: Event) => {
        emitContentMouseleave?.(e as MouseEvent);
      },
    };
  });

  return {
    referenceListeners,
    floatingListeners,
  };
}
