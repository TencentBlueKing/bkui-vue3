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

import { ref, watch, onScopeDispose, type Ref } from 'vue';

import type { PopoverDelay, UseDelayReturn } from '../types';

/**
 * 解析延迟配置为 [showDelay, hideDelay] 数组
 */
export function resolveDelay(delay: PopoverDelay): [number, number] {
  if (Array.isArray(delay)) {
    return [delay[0] ?? 0, delay[1] ?? delay[0] ?? 0];
  }
  return [delay ?? 0, delay ?? 0];
}

export interface UseDelayOptions {
  /** 初始显示状态 */
  isShow: boolean;
  /** 延迟配置 */
  popoverDelay: PopoverDelay;
  /** 是否禁用 */
  disabled: boolean;
  /** 是否始终显示 */
  always: boolean;
  /** 触发方式 */
  trigger: string;
}

/**
 * 管理 Popover 的显示/隐藏延迟逻辑
 *
 * 主要功能：
 * 1. 延迟显示/隐藏
 * 2. 清理定时器避免内存泄漏
 * 3. 支持取消隐藏（stopHide）
 * 4. 自动同步外部 isShow 状态
 */
export function useDelay(
  options: Ref<UseDelayOptions>,
  emit?: (event: string, payload: any) => void,
): UseDelayReturn {
  // 内部显示状态
  const isOpen = ref(options.value.isShow);

  // 定时器 ID
  let showTimer: ReturnType<typeof setTimeout> | undefined;
  let hideTimer: ReturnType<typeof setTimeout> | undefined;

  /**
   * 清除所有定时器
   */
  const clearTimers = () => {
    if (showTimer !== undefined) {
      clearTimeout(showTimer);
      showTimer = undefined;
    }
    if (hideTimer !== undefined) {
      clearTimeout(hideTimer);
      hideTimer = undefined;
    }
  };

  /**
   * 显示弹出层
   */
  const show = () => {
    // 禁用状态不执行
    if (options.value.disabled) {
      return;
    }

    // 始终显示模式，直接设置状态
    if (options.value.always) {
      isOpen.value = true;
      return;
    }

    // 清除隐藏定时器，避免冲突
    if (hideTimer !== undefined) {
      clearTimeout(hideTimer);
      hideTimer = undefined;
    }

    const [showDelay] = resolveDelay(options.value.popoverDelay);

    if (showDelay <= 0) {
      isOpen.value = true;
    } else {
      showTimer = setTimeout(() => {
        isOpen.value = true;
        showTimer = undefined;
      }, showDelay);
    }
  };

  /**
   * 隐藏弹出层
   */
  const hide = () => {
    // 始终显示模式不隐藏
    if (options.value.always) {
      return;
    }

    // 清除显示定时器，避免冲突
    if (showTimer !== undefined) {
      clearTimeout(showTimer);
      showTimer = undefined;
    }

    const [, hideDelay] = resolveDelay(options.value.popoverDelay);

    if (hideDelay <= 0) {
      isOpen.value = false;
    } else {
      hideTimer = setTimeout(() => {
        isOpen.value = false;
        hideTimer = undefined;
      }, hideDelay);
    }
  };

  /**
   * 切换显示/隐藏状态
   */
  const toggle = () => {
    // always 模式下不允许切换
    if (options.value.always) {
      return;
    }
    if (isOpen.value) {
      hide();
    } else {
      show();
    }
  };

  /**
   * 停止隐藏（取消延时隐藏）
   * 常用于 hover 触发时，鼠标移入弹出内容区域时取消隐藏
   */
  const stopHide = () => {
    if (hideTimer !== undefined) {
      clearTimeout(hideTimer);
      hideTimer = undefined;
    }
  };

  // 监听外部 isShow 变化，同步内部状态
  watch(
    () => options.value.isShow,
    (newVal) => {
      if (options.value.trigger === 'manual' || options.value.always) {
        // 避免循环更新：只有当状态不一致时才更新
        if (newVal && !isOpen.value) {
          show();
        } else if (!newVal && isOpen.value) {
          hide();
        }
      }
    },
    { immediate: true },
  );

  // 监听 always 变化
  watch(
    () => options.value.always,
    (newVal) => {
      if (newVal) {
        isOpen.value = true;
      }
    },
    { immediate: true },
  );

  // 监听 disabled 变化
  watch(
    () => options.value.disabled,
    (newVal) => {
      if (newVal) {
        clearTimers();
        isOpen.value = false;
      }
    },
  );

  // 监听 isOpen 变化，触发事件
  watch(isOpen, (newVal) => {
    if (emit) {
      if (newVal) {
        emit('afterShow', { isShow: true });
      } else {
        emit('afterHidden', { isShow: false });
      }
    }
  });

  // 组件卸载时自动清理定时器
  onScopeDispose(() => {
    clearTimers();
  });

  return {
    isOpen,
    show,
    hide,
    toggle,
    stopHide,
    clearTimers,
  };
}
