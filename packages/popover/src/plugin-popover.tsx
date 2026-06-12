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

import { createApp, reactive, ref, h, onMounted, onBeforeUnmount, type App, type ComponentPublicInstance } from 'vue';

import Popover from './popover';
import { PopoverProps } from './props';
import type { PopoverPluginOptions, PopoverPluginInstance } from './types';

/**
 * 判断是否为有效的 DOM 元素
 */
function isElement(element: unknown): element is HTMLElement {
  return element instanceof Element || element instanceof HTMLDocument;
}

/**
 * 判断是否为有效的选择器
 */
function isValidSelector(query: string): boolean {
  try {
    const container = document.querySelector(query);
    return container instanceof HTMLElement;
  } catch {
    return false;
  }
}

/**
 * 获取 boundary 对应的 DOM 元素
 */
function getBoundaryElement(boundary: string | HTMLElement, target: HTMLElement | MouseEvent): HTMLElement {
  if (typeof boundary === 'string') {
    if (/^body$/i.test(boundary)) {
      return document.body;
    }

    if (/^parent$/i.test(boundary)) {
      const targetElement = target instanceof MouseEvent
        ? (target.target as HTMLElement)
        : target;
      return targetElement?.parentElement || document.body;
    }

    if (isValidSelector(boundary)) {
      return document.querySelector(boundary) as HTMLElement;
    }
  }

  if (isElement(boundary)) {
    return boundary;
  }

  return document.body;
}

/**
 * 创建命令式 Popover 组件
 *
 * @example
 * ```ts
 * const popover = $bkPopover({
 *   target: document.querySelector('#btn'),
 *   content: '提示内容',
 *   placement: 'top',
 * });
 *
 * popover.show();
 * popover.hide();
 * popover.close();
 * ```
 */
export default function createPopoverComponent(options: PopoverPluginOptions): PopoverPluginInstance {
  let appInstance: App | null = null;
  let vmInstance: ComponentPublicInstance | null = null;
  let containerElement: HTMLElement | null = null;

  // 是否立即创建实例
  const immediate = options.immediate ?? true;

  // 合并默认配置
  const resolvedOptions = reactive({
    boundary: 'body',
    placement: 'top',
    autoVisibility: true,
    isShow: false,
    trigger: 'manual',
    ...options,
    allowHtml: true,
  });

  // 目标元素引用
  const targetRef = ref<HTMLElement | MouseEvent>(resolvedOptions.target);

  /**
   * Popover 包装组件
   */
  const PopoverWrapper = {
    name: '$bkPopover',
    setup(_: unknown, { expose }: { expose: (exposed: Record<string, unknown>) => void }) {
      // 从 PopoverProps 中提取有效的 props（排除 content，content 由 slot 处理）
      const popoverProps = reactive(
        Object.keys(PopoverProps).reduce<Record<string, unknown>>(
          (result, key) => {
            // 如果 content 是 HTMLElement，不作为 prop 传递
            if (key === 'content' && isElement(resolvedOptions.content)) {
              return result;
            }
            if (Object.prototype.hasOwnProperty.call(resolvedOptions, key)) {
              result[key] = (resolvedOptions as Record<string, unknown>)[key];
            }
            return result;
          },
          {},
        ),
      );

      const popoverRef = ref<ComponentPublicInstance | null>(null);
      const contentContainerRef = ref<HTMLElement | null>(null);
      const contentElement = isElement(resolvedOptions.content) ? resolvedOptions.content : null;

      /**
       * 显示弹出层
       */
      const show = () => {
        (popoverRef.value as any)?.show?.();
      };

      /**
       * 隐藏弹出层
       */
      const hide = () => {
        (popoverRef.value as any)?.hide?.();
      };

      /**
       * 停止隐藏
       */
      const stopHide = () => {
        (popoverRef.value as any)?.stopHide?.();
      };

      /**
       * 更新目标元素
       */
      const updateTarget = (target: HTMLElement | MouseEvent) => {
        targetRef.value = target;
        (popoverRef.value as any)?.resetPopover?.();
      };

      /**
       * 更新弹出层位置
       */
      const updatePopover = () => {
        (popoverRef.value as any)?.updatePopover?.();
      };

      // 事件处理
      const handleContentMouseenter = () => {
        (resolvedOptions as any).onContentMouseenter?.();
      };

      const handleContentMouseleave = () => {
        (resolvedOptions as any).onContentMouseleave?.();
      };

      const handleAfterHidden = () => {
        (resolvedOptions as any).onHide?.();
      };

      const handleAfterShow = () => {
        (resolvedOptions as any).onShow?.();
      };

      // 挂载后将 HTMLElement content 添加到容器中
      onMounted(() => {
        if (contentElement && contentContainerRef.value) {
          contentContainerRef.value.appendChild(contentElement);
        }
      });

      // 卸载前移除 HTMLElement content
      onBeforeUnmount(() => {
        if (contentElement && contentElement.parentNode) {
          contentElement.parentNode.removeChild(contentElement);
        }
      });

      expose({
        show,
        hide,
        updateTarget,
        updatePopover,
        stopHide,
      });

      return () => {
        // 虚拟 reference 元素（用于定位）
        const virtualReference = {
          getBoundingClientRect: () => {
            const target = targetRef.value;
            if (target instanceof MouseEvent) {
              return {
                width: 0,
                height: 0,
                x: target.clientX,
                y: target.clientY,
                top: target.clientY,
                left: target.clientX,
                right: target.clientX,
                bottom: target.clientY,
              };
            }
            if (isElement(target)) {
              return target.getBoundingClientRect();
            }
            return {
              width: 0,
              height: 0,
              x: 0,
              y: 0,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            };
          },
        };

        // 如果 content 是 HTMLElement，使用 slot 渲染
        const slots = contentElement ? {
          content: () => h('div', {
            ref: ((el: Element | ComponentPublicInstance | null) => {
              contentContainerRef.value = el as HTMLElement | null;
              // 每次渲染时确保 content 在容器内
              if (el && contentElement && !(el as HTMLElement).contains(contentElement)) {
                (el as HTMLElement).appendChild(contentElement);
              }
            }),
            style: { display: 'contents' },
          }),
        } : undefined;

        return h(
          Popover,
          {
            ...popoverProps,
            ref: popoverRef,
            reference: virtualReference,
            onAfterHidden: handleAfterHidden,
            onAfterShow: handleAfterShow,
            onContentMouseenter: handleContentMouseenter,
            onContentMouseleave: handleContentMouseleave,
          },
          slots,
        );
      };
    },
  };

  /**
   * 安装组件实例
   */
  const install = () => {
    if (appInstance !== null) {
      return;
    }

    // 创建容器元素
    containerElement = document.createElement('div');
    const boundaryElement = getBoundaryElement(
      resolvedOptions.boundary as string,
      resolvedOptions.target,
    );
    boundaryElement.appendChild(containerElement);

    // 创建 Vue 应用实例
    appInstance = createApp(PopoverWrapper);
    vmInstance = appInstance.mount(containerElement);
  };

  /**
   * 卸载组件实例
   */
  const uninstall = () => {
    // 如果 content 是 HTMLElement，先移除
    if (isElement(options.content)) {
      (options.content as HTMLElement).remove();
    }

    if (appInstance) {
      appInstance.unmount();
      appInstance = null;
    }

    if (containerElement) {
      containerElement.remove();
      containerElement = null;
    }

    vmInstance = null;
  };

  /**
   * 关闭并销毁实例
   */
  const close = () => {
    uninstall();
  };

  /**
   * 显示弹出层
   */
  const show = (target?: HTMLElement | MouseEvent) => {
    install();

    if (target) {
      (vmInstance as any)?.updateTarget(target);
    }

    (vmInstance as any)?.show();
  };

  /**
   * 更新目标位置
   */
  const update = (e: MouseEvent) => {
    (vmInstance as any)?.updateTarget(e);
  };

  /**
   * 隐藏弹出层
   */
  const hidePopover = () => {
    (vmInstance as any)?.hide();
  };

  // 如果设置了 immediate，立即安装
  if (immediate) {
    install();
  }

  return {
    install,
    close,
    show,
    hide: hidePopover,
    update,
    uninstall,
    get vm() {
      return vmInstance;
    },
    get $el(): HTMLElement {
      return (vmInstance as any)?.$el;
    },
  };
}
