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

import { computed, unref, type CSSProperties, type Ref, type ComputedRef } from 'vue';

import {
  useFloating as useFloatingUI,
  offset,
  flip,
  shift,
  arrow as arrowMiddleware,
  hide,
  autoPlacement,
  autoUpdate,
  type Placement,
  type Strategy,
  type MiddlewareData,
} from '@floating-ui/vue';

import type { IAxesOffsets, PopoverPlacement, VirtualElement } from '../types';

export interface UseFloatingProps {
  /** 弹出位置 */
  placement: PopoverPlacement;
  /** 偏移量 */
  offset: IAxesOffsets | number;
  /** 边界内边距 */
  padding: number;
  /** 是否显示箭头 */
  arrow: boolean;
  /** 是否自动选择最佳位置 */
  autoPlacement: boolean;
  /** 滚动超出可视范围时自动隐藏 */
  autoVisibility: boolean;
  /** 是否禁用 transform 定位 */
  disableTransform: boolean;
  /** 定位策略：'fixed' 不会导致容器产生滚动溢出 */
  strategy: Strategy;
  /** 当前是否显示 */
  isOpen: boolean;
}

export interface UseFloatingReturn {
  /** 浮动元素样式 */
  floatingStyles: Ref<CSSProperties>;
  /** 箭头样式 */
  arrowStyles: Ref<CSSProperties>;
  /** 实际的位置（可能因 flip 等发生变化） */
  placement: Ref<Placement>;
  /** 中间件数据 */
  middlewareData: Ref<MiddlewareData>;
  /** 手动更新位置 */
  update: () => void;
  /** 是否已完成定位 */
  isPositioned: Ref<boolean>;
  /** 箭头方向 */
  arrowSide: Ref<string>;
}

/**
 * 解析偏移量配置
 */
function resolveOffset(
  offsetValue: IAxesOffsets | number,
): { mainAxis?: number; crossAxis?: number; alignmentAxis?: number } | number {
  if (typeof offsetValue === 'number') {
    return offsetValue;
  }
  return {
    mainAxis: offsetValue.mainAxis,
    crossAxis: offsetValue.crossAxis,
    alignmentAxis: offsetValue.alignmentAxis ?? undefined,
  };
}

/**
 * 获取箭头对应的边
 */
function getArrowSide(placement: Placement): string {
  const side = placement.split('-')[0];
  const sideMap: Record<string, string> = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  };
  return sideMap[side] || 'bottom';
}

/**
 * 管理 Popover 的浮动定位
 *
 * 基于 @floating-ui/vue 实现，主要功能：
 * 1. 自动定位浮动元素
 * 2. 支持多种中间件（offset、flip、shift、arrow、hide、autoPlacement）
 * 3. 自动更新位置
 * 4. 计算箭头位置
 */
export function usePopoverFloating(
  props: Ref<UseFloatingProps>,
  referenceRef: ComputedRef<HTMLElement | VirtualElement | null> | Ref<HTMLElement | VirtualElement | null>,
  floatingRef: Ref<HTMLElement | null>,
  arrowRef: Ref<HTMLElement | null>,
): UseFloatingReturn {
  // 构建中间件数组
  const middleware = computed(() => {
    const middlewareList = [];

    // 1. offset - 偏移量
    middlewareList.push(offset(resolveOffset(props.value.offset)));

    // 2. flip - 自动翻转
    if (!props.value.autoPlacement) {
      middlewareList.push(flip());
    }

    // 3. shift - 边界偏移
    middlewareList.push(shift({ padding: props.value.padding }));

    // 4. autoPlacement - 自动选择最佳位置
    if (props.value.autoPlacement) {
      middlewareList.push(autoPlacement());
    }

    // 5. arrow - 箭头定位
    if (props.value.arrow && arrowRef.value) {
      middlewareList.push(arrowMiddleware({ element: arrowRef }));
    }

    // 6. hide - 自动隐藏
    if (props.value.autoVisibility) {
      middlewareList.push(hide());
    }

    return middlewareList;
  });

  // 使用 @floating-ui/vue 的 useFloating
  const {
    floatingStyles: rawFloatingStyles,
    middlewareData,
    placement,
    update,
    isPositioned,
  } = useFloatingUI(referenceRef, floatingRef, {
    placement: computed(() => props.value.placement as Placement),
    strategy: computed(() => props.value.strategy),
    middleware,
    whileElementsMounted: autoUpdate,
    transform: computed(() => !props.value.disableTransform),
    open: computed(() => props.value.isOpen),
  });

  // 处理浮动元素样式
  const floatingStyles = computed<CSSProperties>(() => {
    const styles: CSSProperties = { ...rawFloatingStyles.value };

    // 处理 hide 中间件的隐藏逻辑
    if (props.value.autoVisibility && middlewareData.value.hide?.referenceHidden) {
      const reference = unref(referenceRef);
      // floating-ui 的 referenceHidden 在复杂布局（scroll 容器 + 绝对定位触发器 + teleport）下可能出现误判。
      // 这里增加一次“实际可见性”兜底：当 reference 在视口内且命中 elementFromPoint 时，不隐藏。
      try {
        const rect = reference?.getBoundingClientRect?.();
        if (rect) {
          const vw = window.innerWidth || document.documentElement.clientWidth;
          const vh = window.innerHeight || document.documentElement.clientHeight;
          const inViewport = rect.bottom > 0 && rect.right > 0 && rect.top < vh && rect.left < vw;

          if (inViewport && reference instanceof HTMLElement) {
            const cx = Math.min(Math.max(rect.left + rect.width / 2, 0), vw - 1);
            const cy = Math.min(Math.max(rect.top + rect.height / 2, 0), vh - 1);
            const hit = document.elementFromPoint(cx, cy);
            if (hit && reference.contains(hit)) {
              return styles;
            }
          }

          // 虚拟元素无法做 DOM 命中校验，视口内则不隐藏
          if (inViewport && reference && !(reference instanceof HTMLElement)) {
            return styles;
          }
        }
      } catch {
        // ignore
      }

      styles.visibility = 'hidden';
    }

    return styles;
  });

  // 计算箭头方向
  const arrowSide = computed(() => getArrowSide(placement.value));

  // 计算箭头样式
  const arrowStyles = computed<CSSProperties>(() => {
    if (!props.value.arrow || !middlewareData.value.arrow) {
      return {};
    }

    const { x: arrowX, y: arrowY } = middlewareData.value.arrow;
    const side = arrowSide.value;

    const styles: CSSProperties = {
      position: 'absolute',
    };

    // 根据箭头方向设置位置
    // arrowX/arrowY 是箭头在浮动元素内的偏移位置
    // side 是箭头应该突出的边
    if (side === 'top' || side === 'bottom') {
      // 水平方向：设置 left 偏移，垂直方向设置突出位置
      if (arrowX != null) {
        styles.left = `${arrowX}px`;
      }
      styles[side] = '-4px';
    } else {
      // 垂直方向：设置 top 偏移，水平方向设置突出位置
      if (arrowY != null) {
        styles.top = `${arrowY}px`;
      }
      styles[side] = '-4px';
    }

    return styles;
  });

  return {
    floatingStyles,
    arrowStyles,
    placement,
    middlewareData,
    update,
    isPositioned,
    arrowSide,
  };
}

/**
 * 创建用于 composables/index.ts 的导出
 */
export { usePopoverFloating as useFloating };
